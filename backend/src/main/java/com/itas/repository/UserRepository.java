package com.itas.repository;

import com.itas.model.User;
import com.itas.model.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByUserType(String userType);
    List<User> findByActiveTrue();
    
    // ADD THIS METHOD for RoleService
    List<User> findByRoleId(Long roleId);
    
    // ADD THIS if you want to keep the original AuthController method
    Optional<User> findByUsernameAndPassword(String username, String password);
    
    // Dashboard methods
    long countByActive(boolean active);
    long countByUserType(UserType userType);
}