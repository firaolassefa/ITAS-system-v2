package com.itas.controller;

import com.itas.dto.WebinarRequest;
import com.itas.model.User;
import com.itas.model.UserType;
import com.itas.security.JwtTokenProvider;
import com.itas.service.WebinarService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class WebinarControllerTest {
    
    @Autowired
    private WebApplicationContext context;
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private JwtTokenProvider tokenProvider;
    
    @MockBean
    private WebinarService webinarService;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .build();
        
        // Create mock authentication for admin
        User adminUser = new User();
        adminUser.setId(1L);
        adminUser.setUsername("trainingadmin");
        adminUser.setUserType(UserType.TRAINING_ADMIN);
        
        UsernamePasswordAuthenticationToken adminAuth = 
            new UsernamePasswordAuthenticationToken(
                adminUser, null,
                List.of(new SimpleGrantedAuthority("ROLE_TRAINING_ADMIN"))
            );
        SecurityContextHolder.getContext().setAuthentication(adminAuth);
        
        // Create mock authentication for taxpayer
        User taxpayerUser = new User();
        taxpayerUser.setId(2L);
        taxpayerUser.setUsername("taxpayer");
        taxpayerUser.setUserType(UserType.TAXPAYER);
        
        UsernamePasswordAuthenticationToken taxpayerAuth = 
            new UsernamePasswordAuthenticationToken(
                taxpayerUser, null,
                List.of(new SimpleGrantedAuthority("ROLE_TAXPAYER"))
            );
        SecurityContextHolder.getContext().setAuthentication(taxpayerAuth);
    }
    
    @Test
    void testScheduleWebinar_Success() throws Exception {
        String requestJson = """
            {
                "title": "Test Webinar",
                "description": "Test Description",
                "scheduleTime": "%s",
                "durationMinutes": 60,
                "presenters": ["Presenter 1", "Presenter 2"],
                "maxAttendees": 100,
                "targetAudience": "ALL_TAXPAYERS"
            }
            """.formatted(LocalDateTime.now().plusDays(1).toString());
        
        mockMvc.perform(post("/api/webinars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk()); // or the status your controller returns
    }
    
    // Remove the springSecurity() method call since it doesn't exist
    // Remove token generation since we're mocking JwtTokenProvider
}