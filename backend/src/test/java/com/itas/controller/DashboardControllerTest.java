package com.itas.controller;

import com.itas.model.User;
import com.itas.model.UserType;
import com.itas.repository.*;
import com.itas.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Dashboard Controller Tests")
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private EnrollmentRepository enrollmentRepository;

    @MockBean
    private CertificateRepository certificateRepository;

    @MockBean
    private CourseRepository courseRepository;

    @MockBean
    private WebinarRepository webinarRepository;
    
    @MockBean
    private ResourceRepository resourceRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("taxpayer");
        testUser.setFullName("Test Taxpayer");
        testUser.setEmail("test@example.com");
        testUser.setUserType(UserType.TAXPAYER);
        testUser.setActive(true);
    }

    @Test
    @DisplayName("Should return dashboard data for authenticated taxpayer")
    @WithMockUser(username = "taxpayer", roles = {"TAXPAYER"})
    void shouldReturnDashboardDataForTaxpayer() throws Exception {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(enrollmentRepository.countByUserId(1L)).thenReturn(5L);
        when(certificateRepository.countByUserId(1L)).thenReturn(2L);

        // When & Then
        mockMvc.perform(get("/dashboard/user/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Dashboard data retrieved"))
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.data.userId").value(1));
    }

    @Test
    @DisplayName("Should return 401 for unauthenticated request")
    void shouldReturn401ForUnauthenticatedRequest() throws Exception {
        // When & Then
        mockMvc.perform(get("/dashboard/user/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should return test endpoint without authentication")
    void shouldReturnTestEndpoint() throws Exception {
        // When & Then
        mockMvc.perform(get("/dashboard/test")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Dashboard controller is working")));
    }

    @Test
    @DisplayName("Should return system admin dashboard")
    @WithMockUser(username = "admin", roles = {"SYSTEM_ADMIN"})
    void shouldReturnSystemAdminDashboard() throws Exception {
        // Given
        when(userRepository.count()).thenReturn(100L);
        when(courseRepository.count()).thenReturn(20L);
        when(resourceRepository.count()).thenReturn(50L);

        // When & Then
        mockMvc.perform(get("/dashboard/system-admin")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("System admin dashboard data retrieved"))
                .andExpect(jsonPath("$.data").exists());
    }

    @Test
    @DisplayName("Should return manager dashboard")
    @WithMockUser(username = "manager", roles = {"MANAGER"})
    void shouldReturnManagerDashboard() throws Exception {
        // Given
        when(userRepository.count()).thenReturn(100L);
        when(courseRepository.count()).thenReturn(20L);
        when(enrollmentRepository.count()).thenReturn(150L);

        // When & Then
        mockMvc.perform(get("/dashboard/manager")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Manager dashboard data retrieved"))
                .andExpect(jsonPath("$.data.totalUsers").exists());
    }
}
