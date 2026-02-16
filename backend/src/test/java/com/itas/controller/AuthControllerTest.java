package com.itas.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void testLoginSuccess() throws Exception {
        String loginJson = "{\"username\":\"taxpayer\",\"password\":\"123\"}";
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.user.username").value("taxpayer"));
    }
    
    @Test
    public void testLoginInvalidCredentials() throws Exception {
        String loginJson = "{\"username\":\"wrong\",\"password\":\"wrong\"}";
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isUnauthorized());
    }
    
    @Test
    public void testLoginMissingFields() throws Exception {
        String loginJson = "{\"username\":\"taxpayer\"}";
        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isBadRequest());
    }
}