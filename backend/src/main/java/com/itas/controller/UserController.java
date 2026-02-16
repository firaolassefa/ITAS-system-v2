package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.User;
import com.itas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map; 
@RestController
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Remove passwords from response
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(new ApiResponse<>("Users retrieved", users));
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return userRepository.findById(userId)
            .map(user -> {
                user.setPassword(null);
                return ResponseEntity.ok(new ApiResponse<>("User found", user));
            })
            .orElse(ResponseEntity.status(404).body(new ApiResponse<>("User not found", null)));
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody User userUpdates) {
        return userRepository.findById(userId)
            .map(user -> {
                if (userUpdates.getFullName() != null) user.setFullName(userUpdates.getFullName());
                if (userUpdates.getEmail() != null) user.setEmail(userUpdates.getEmail());
                if (userUpdates.getTaxNumber() != null) user.setTaxNumber(userUpdates.getTaxNumber());
                if (userUpdates.getCompanyName() != null) user.setCompanyName(userUpdates.getCompanyName());
                if (userUpdates.getPhoneNumber() != null) user.setPhoneNumber(userUpdates.getPhoneNumber());
                
                User updatedUser = userRepository.save(user);
                updatedUser.setPassword(null);
                return ResponseEntity.ok(new ApiResponse<>("User updated", updatedUser));
            })
            .orElse(ResponseEntity.status(404).body(new ApiResponse<>("User not found", null)));
    }
    
    @PatchMapping("/{userId}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");
        
        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("Current and new passwords are required", null));
        }
        
        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("New password must be at least 6 characters", null));
        }
        
        return userRepository.findById(userId)
            .map(user -> {
                // Verify current password
                if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                    return ResponseEntity.status(400).body(new ApiResponse<>("Current password is incorrect", null));
                }
                
                // Update password
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                
                return ResponseEntity.ok(new ApiResponse<>("Password changed successfully", null));
            })
            .orElse(ResponseEntity.status(404).body(new ApiResponse<>("User not found", null)));
    }
    
    @PatchMapping("/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> request) {
        
        Boolean active = request.get("active");
        if (active == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("Active status is required", null));
        }
        
        return userRepository.findById(userId)
            .map(user -> {
                user.setActive(active);
                User updatedUser = userRepository.save(user);
                updatedUser.setPassword(null);
                return ResponseEntity.ok(new ApiResponse<>("User status updated", updatedUser));
            })
            .orElse(ResponseEntity.status(404).body(new ApiResponse<>("User not found", null)));
    }
}