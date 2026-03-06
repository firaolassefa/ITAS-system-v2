package com.itas.security;

import com.itas.model.User;
import com.itas.model.UserRole;
import com.itas.repository.UserRepository;
import com.itas.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("=== CustomUserDetailsService.loadUserByUsername ===");
        System.out.println("Loading user: " + username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        System.out.println("User found - ID: " + user.getId() + ", Active: " + user.isActive());
        System.out.println("Password hash from DB: " + (user.getPassword() != null ? user.getPassword().substring(0, 20) + "..." : "NULL"));
        
        if (!user.isActive()) {
            throw new UsernameNotFoundException("User account is disabled: " + username);
        }

        // Get user roles by user ID instead of User object
        List<UserRole> userRoles = userRoleRepository.findByUserId(user.getId());
        System.out.println("Found " + userRoles.size() + " roles for user");
        
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // Add user type as a role
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getUserType().name()));
        System.out.println("Added role: ROLE_" + user.getUserType().name());
        
        // Add specific permissions from user roles
        for (UserRole role : userRoles) {
            // Add role name
            if (role.getRoleName() != null) {
                authorities.add(new SimpleGrantedAuthority(role.getRoleName()));
                System.out.println("Added role: " + role.getRoleName());
            }
            // Add individual permissions if they exist
            if (role.getPermissions() != null && !role.getPermissions().isEmpty()) {
                String[] permissions = role.getPermissions().split(",");
                for (String permission : permissions) {
                    authorities.add(new SimpleGrantedAuthority(permission.trim()));
                    System.out.println("Added permission: " + permission.trim());
                }
            }
        }

        System.out.println("Total authorities: " + authorities.size());
        
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(!user.isActive())
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
        
        System.out.println("UserDetails created successfully");
        return userDetails;
    }
}
