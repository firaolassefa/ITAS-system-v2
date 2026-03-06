package com.itas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itas.model.User;
import com.itas.model.UserType;
import com.itas.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("User Controller Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("taxpayer");
        testUser.setPassword("$2a$10$hashedpassword");
        testUser.setFullName("Test Taxpayer");
        testUser.setEmail("test@example.com");
        testUser.setUserType(UserType.TAXPAYER);
        testUser.setActive(true);
    }

    @Test
    @DisplayName("Should get user by ID when authenticated")
    @WithMockUser(username = "taxpayer", roles = {"TAXPAYER"})
    void shouldGetUserById() throws Exception {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When & Then
        mockMvc.perform(get("/users/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User found"))
                .andExpect(jsonPath("$.data.username").value("taxpayer"))
                .andExpect(jsonPath("$.data.password").doesNotExist()); // Password should be removed
    }

    @Test
    @DisplayName("Should return 404 when user not found")
    @WithMockUser(username = "taxpayer", roles = {"TAXPAYER"})
    void shouldReturn404WhenUserNotFound() throws Exception {
        // Given
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/users/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("User not found"));
    }

    @Test
    @DisplayName("Should update own profile")
    @WithMockUser(username = "taxpayer", roles = {"TAXPAYER"})
    void shouldUpdateOwnProfile() throws Exception {
        // Given
        User updatedUser = new User();
        updatedUser.setFullName("Updated Name");
        updatedUser.setEmail("updated@example.com");

        when(userRepository.findByUsername("taxpayer")).thenReturn(Optional.of(testUser));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When & Then
        mockMvc.perform(put("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User updated"));
    }

    @Test
    @DisplayName("Should not allow updating other user's profile")
    @WithMockUser(username = "taxpayer", roles = {"TAXPAYER"})
    void shouldNotAllowUpdatingOtherUsersProfile() throws Exception {
        // Given
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setUsername("otheruser");

        User updatedUser = new User();
        updatedUser.setFullName("Hacker Name");

        when(userRepository.findByUsername("taxpayer")).thenReturn(Optional.of(testUser));
        when(userRepository.findById(2L)).thenReturn(Optional.of(otherUser));

        // When & Then
        mockMvc.perform(put("/users/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("You can only update your own profile"));
    }

    @Test
    @DisplayName("Should change password with correct current password")
    @WithMockUser(username = "taxpayer", roles = {"TAXPAYER"})
    void shouldChangePasswordWithCorrectCurrentPassword() throws Exception {
        // Given
        Map<String, String> passwordRequest = new HashMap<>();
        passwordRequest.put("currentPassword", "oldPassword");
        passwordRequest.put("newPassword", "newPassword123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newPassword123")).thenReturn("$2a$10$newhashedpassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When & Then
        mockMvc.perform(patch("/users/1/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(passwordRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password changed successfully"));
    }

    @Test
    @DisplayName("Should reject password change with incorrect current password")
    @WithMockUser(username = "taxpayer", roles = {"TAXPAYER"})
    void shouldRejectPasswordChangeWithIncorrectCurrentPassword() throws Exception {
        // Given
        Map<String, String> passwordRequest = new HashMap<>();
        passwordRequest.put("currentPassword", "wrongPassword");
        passwordRequest.put("newPassword", "newPassword123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", testUser.getPassword())).thenReturn(false);

        // When & Then
        mockMvc.perform(patch("/users/1/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(passwordRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Current password is incorrect"));
    }

    @Test
    @DisplayName("Should reject short passwords")
    @WithMockUser(username = "taxpayer", roles = {"TAXPAYER"})
    void shouldRejectShortPasswords() throws Exception {
        // Given
        Map<String, String> passwordRequest = new HashMap<>();
        passwordRequest.put("currentPassword", "oldPassword");
        passwordRequest.put("newPassword", "123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When & Then
        mockMvc.perform(patch("/users/1/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(passwordRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("New password must be at least 6 characters"));
    }
}
