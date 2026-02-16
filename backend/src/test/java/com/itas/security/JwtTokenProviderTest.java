package com.itas.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test Cases for JWT Token Provider
 * Tests authentication token generation and validation
 */
public class JwtTokenProviderTest {
    
    private JwtTokenProvider tokenProvider;
    
    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "test-secret-key-for-jwt-token-generation-minimum-256-bits");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationInMs", 3600000);
    }
    
    /**
     * Test Case 6: Generate valid JWT token
     */
    @Test
    void testGenerateToken_Success() {
        // Arrange
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "testuser",
                "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        
        // Act
        String token = tokenProvider.generateToken(authentication);
        
        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }
    
    /**
     * Test Case 7: Validate valid token
     */
    @Test
    void testValidateToken_ValidToken() {
        // Arrange
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "testuser",
                "password",
                Collections.emptyList()
        );
        String token = tokenProvider.generateToken(authentication);
        
        // Act
        boolean isValid = tokenProvider.validateToken(token);
        
        // Assert
        assertTrue(isValid);
    }
    
    /**
     * Test Case 8: Validate invalid token
     */
    @Test
    void testValidateToken_InvalidToken() {
        // Arrange
        String invalidToken = "invalid.token.here";
        
        // Act
        boolean isValid = tokenProvider.validateToken(invalidToken);
        
        // Assert
        assertFalse(isValid);
    }
    
    /**
     * Test Case 9: Extract username from token
     */
    @Test
    void testGetUsernameFromToken_Success() {
        // Arrange
        String expectedUsername = "testuser";
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                expectedUsername,
                "password",
                Collections.emptyList()
        );
        String token = tokenProvider.generateToken(authentication);
        
        // Act
        String username = tokenProvider.getUsernameFromToken(token);
        
        // Assert
        assertEquals(expectedUsername, username);
    }
}
