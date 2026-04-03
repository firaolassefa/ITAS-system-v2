package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.dto.LoginRequest;
import com.itas.dto.LoginResponse;
import com.itas.model.User;
import com.itas.model.UserType;
import com.itas.repository.UserRepository;
import com.itas.repository.UserRoleRepository;
import com.itas.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User authentication and authorization endpoints")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserRoleRepository userRoleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @PostMapping("/login")
    @Operation(
        summary = "User login",
        description = "Authenticate user with username and password. Returns JWT token and user details.",
        security = {}
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Login successful",
            content = @Content(schema = @Schema(implementation = LoginResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Invalid credentials"
        )
    })
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request.getUsername() == null || request.getPassword() == null) {
                return ResponseEntity.status(400).body(new ApiResponse<>("Username and password are required", null));
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate JWT token
            String token = tokenProvider.generateToken(authentication);
            
            // Get user details
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Create response without password
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("fullName", user.getFullName());
            userData.put("email", user.getEmail());
            userData.put("userType", user.getUserType());
            userData.put("taxNumber", user.getTaxNumber());
            userData.put("companyName", user.getCompanyName());
            userData.put("active", user.isActive());
            userData.put("createdAt", user.getCreatedAt());
            userData.put("lastLogin", user.getLastLogin());
            
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            // Never send password hash to frontend
            user.setPassword(null);
            response.setUser(user);
            response.setMessage("Login successful");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            
            ApiResponse<Object> errorResponse = new ApiResponse<>("Invalid username or password", null);
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        // Check if username exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>("Username already exists", null)
            );
        }
        
        // Check if email exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<>("Email already registered", null)
            );
        }
        
        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default values
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLogin(LocalDateTime.now());
        
        // Ensure user type is set (default to TAX_AGENT if null)
        if (user.getUserType() == null) {
            user.setUserType(UserType.TAX_AGENT);
        }
        
        // Save to database
        User savedUser = userRepository.save(user);
        
        // Remove password from response
        savedUser.setPassword(null);
        
        return ResponseEntity.ok(new ApiResponse<>("Registration successful", savedUser));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new ApiResponse<>("Logout successful", null));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("fullName", user.getFullName());
        userData.put("email", user.getEmail());
        userData.put("userType", user.getUserType());
        userData.put("taxNumber", user.getTaxNumber());
        userData.put("companyName", user.getCompanyName());
        userData.put("active", user.isActive());
        userData.put("createdAt", user.getCreatedAt());
        userData.put("lastLogin", user.getLastLogin());
        
        return ResponseEntity.ok(new ApiResponse<>("Profile retrieved", userData));
    }
    
    @GetMapping("/test-user/{username}")
    public ResponseEntity<?> testUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.ok("User '" + username + "' NOT FOUND in database");
        }
        
        // Test both passwords
        String testPassword1 = "Taxpayer@123";
        String testPassword2 = "password123";
        boolean passwordMatches1 = passwordEncoder.matches(testPassword1, user.getPassword());
        boolean passwordMatches2 = passwordEncoder.matches(testPassword2, user.getPassword());
        
        Map<String, Object> result = new HashMap<>();
        result.put("username", username);
        result.put("exists", true);
        result.put("active", user.isActive());
        result.put("userType", user.getUserType());
        result.put("passwordHash", user.getPassword().substring(0, 30) + "...");
        result.put("testPassword1", testPassword1);
        result.put("passwordMatches1", passwordMatches1);
        result.put("testPassword2", testPassword2);
        result.put("passwordMatches2", passwordMatches2);
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/fix-password/{username}")
    public ResponseEntity<?> fixPassword(@PathVariable String username, @RequestBody Map<String, String> request) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        String newPassword = request.get("newPassword");
        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("newPassword is required");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Password updated successfully for user: " + username);
        result.put("newPassword", newPassword);
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/fix-user-types")
    public ResponseEntity<?> fixUserTypes() {
        // This endpoint is no longer needed — all users use TAXPAYER type
        Map<String, Object> result = new HashMap<>();
        result.put("message", "All external users already use TAXPAYER type");
        return ResponseEntity.ok(new ApiResponse<>("No changes needed", result));
    }
}
