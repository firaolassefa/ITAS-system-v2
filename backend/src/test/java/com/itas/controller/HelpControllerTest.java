package com.itas.controller;

import com.itas.model.HelpContent;
import com.itas.repository.HelpContentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test Cases for Help Controller
 * Tests UC-TP-001: Access Context-Sensitive Help
 */
@ExtendWith(MockitoExtension.class)
public class HelpControllerTest {
    
    @Mock
    private HelpContentRepository helpContentRepository;
    
    @InjectMocks
    private HelpController helpController;
    
    private HelpContent testHelp;
    
    @BeforeEach
    void setUp() {
        testHelp = new HelpContent();
        testHelp.setId(1L);
        testHelp.setFieldName("taxNumber");
        testHelp.setTitle("Tax Number Help");
        testHelp.setShortDescription("Enter your tax identification number");
        testHelp.setDetailedContent("Your tax number is a unique identifier...");
        testHelp.setCategory("TAX_FORMS");
    }
    
    /**
     * Test Case 10: Get help content by field name
     */
    @Test
    void testGetHelpByField_Success() {
        // Arrange
        when(helpContentRepository.findByFieldName("taxNumber"))
                .thenReturn(Optional.of(testHelp));
        
        // Act
        ResponseEntity<?> response = helpController.getHelpByField("taxNumber");
        
        // Assert
        assertEquals(200, response.getStatusCodeValue());
        verify(helpContentRepository, times(1)).findByFieldName("taxNumber");
    }
    
    /**
     * Test Case 11: Get help content by category
     */
    @Test
    void testGetHelpByCategory_Success() {
        // Arrange
        List<HelpContent> helpList = Arrays.asList(testHelp);
        when(helpContentRepository.findByCategory("TAX_FORMS"))
                .thenReturn(helpList);
        
        // Act
        ResponseEntity<?> response = helpController.getHelpByCategory("TAX_FORMS");
        
        // Assert
        assertEquals(200, response.getStatusCodeValue());
        verify(helpContentRepository, times(1)).findByCategory("TAX_FORMS");
    }
    
    /**
     * Test Case 12: Search help content
     */
    @Test
    void testSearchHelp_Success() {
        // Arrange
        List<HelpContent> searchResults = Arrays.asList(testHelp);
        when(helpContentRepository.searchByKeyword("tax"))
                .thenReturn(searchResults);
        
        // Act
        ResponseEntity<?> response = helpController.searchHelp("tax");
        
        // Assert
        assertEquals(200, response.getStatusCodeValue());
        verify(helpContentRepository, times(1)).searchByKeyword("tax");
    }
}
