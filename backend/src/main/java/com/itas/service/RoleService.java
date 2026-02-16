package com.itas.service;

import com.itas.model.User;
import com.itas.model.UserRole;
import com.itas.repository.UserRepository;
import com.itas.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoleService {
    
    @Autowired
    private UserRoleRepository userRoleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<UserRole> getAllRoles() {
        return userRoleRepository.findAll();
    }
    
    public List<UserRole> getUserRoles(Long userId) {
        return userRoleRepository.findByUserId(userId);
    }
    
    public UserRole getRoleById(Long id) {
        return userRoleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }
    
    @Transactional
    public UserRole assignRole(Long userId, String roleName, Long assignedById) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User assignedBy = userRepository.findById(assignedById)
                .orElseThrow(() -> new RuntimeException("Assigner not found"));
        
        // Check if role already exists
        if (userRoleRepository.existsByUserIdAndRoleName(userId, roleName)) {
            throw new RuntimeException("User already has this role");
        }
        
        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRoleName(roleName);
        userRole.setAssignedBy(assignedBy);
        userRole.setAssignedAt(LocalDateTime.now());
        
        return userRoleRepository.save(userRole);
    }
    
    @Transactional
    public void removeRole(Long roleId) {
        UserRole userRole = getRoleById(roleId);
        userRoleRepository.delete(userRole);
    }
    
    @Transactional
    public void removeUserRole(Long userId, String roleName) {
        List<UserRole> roles = userRoleRepository.findByUserId(userId);
        roles.stream()
                .filter(r -> roleName.equals(r.getRoleName()))
                .findFirst()
                .ifPresent(userRoleRepository::delete);
    }
    
    public boolean hasRole(Long userId, String roleName) {
        return userRoleRepository.existsByUserIdAndRoleName(userId, roleName);
    }
    
    @Transactional
    public UserRole createRole(UserRole userRole) {
        userRole.setAssignedAt(LocalDateTime.now());
        return userRoleRepository.save(userRole);
    }
    
    @Transactional
    public UserRole updateRole(Long id, UserRole userRole) {
        UserRole existing = getRoleById(id);
        existing.setRoleName(userRole.getRoleName());
        existing.setAssignedBy(userRole.getAssignedBy());
        return userRoleRepository.save(existing);
    }
    
    @Transactional
    public void deleteRole(Long id) {
        userRoleRepository.deleteById(id);
    }
    
    @Transactional
    public UserRole assignRoleToUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserRole role = getRoleById(roleId);
        role.setUser(user);
        return userRoleRepository.save(role);
    }
}
