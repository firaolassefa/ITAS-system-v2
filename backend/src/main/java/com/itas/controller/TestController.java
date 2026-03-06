package com.itas.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Backend is working!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "{\"status\": \"UP\"}";
    }
    
    @GetMapping("/auth")
    @PreAuthorize("isAuthenticated()")
    public String testAuth(Authentication authentication) {
        return "Authenticated as: " + authentication.getName() + 
               ", Authorities: " + authentication.getAuthorities();
    }
}
