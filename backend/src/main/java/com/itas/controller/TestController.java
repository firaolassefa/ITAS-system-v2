package com.itas.controller;

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
}
