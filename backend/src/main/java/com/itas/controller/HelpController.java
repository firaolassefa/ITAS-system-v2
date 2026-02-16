package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.HelpContent;
import com.itas.repository.HelpContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Help Controller
 * Handles UC-TP-001: Access Context-Sensitive Help
 */
@RestController
@RequestMapping("/help")
public class HelpController {
    
    @Autowired
    private HelpContentRepository helpContentRepository;
    
    /**
     * Get help content by field/context
     * GET /api/help/field/{fieldName}
     */
    @GetMapping("/field/{fieldName}")
    public ResponseEntity<?> getHelpByField(@PathVariable String fieldName) {
        try {
            HelpContent help = helpContentRepository.findByFieldName(fieldName)
                    .orElse(getDefaultHelp());
            
            return ResponseEntity.ok(new ApiResponse<>("Help content retrieved", help));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get help content by category
     * GET /api/help/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getHelpByCategory(@PathVariable String category) {
        try {
            List<HelpContent> helpList = helpContentRepository.findByCategory(category);
            return ResponseEntity.ok(new ApiResponse<>("Help content retrieved", helpList));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Search help content
     * GET /api/help/search?q={query}
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchHelp(@RequestParam String q) {
        try {
            List<HelpContent> results = helpContentRepository.searchByKeyword(q);
            return ResponseEntity.ok(new ApiResponse<>("Search results", results));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Get all help topics
     * GET /api/help/topics
     */
    @GetMapping("/topics")
    public ResponseEntity<?> getAllTopics() {
        try {
            List<HelpContent> topics = helpContentRepository.findAll();
            return ResponseEntity.ok(new ApiResponse<>("All help topics", topics));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Create or update help content (Admin only)
     * POST /api/help
     */
    @PostMapping
    public ResponseEntity<?> createOrUpdateHelp(@RequestBody HelpContent helpContent) {
        try {
            HelpContent saved = helpContentRepository.save(helpContent);
            return ResponseEntity.ok(new ApiResponse<>("Help content saved", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    /**
     * Default help content when specific help is not found
     */
    private HelpContent getDefaultHelp() {
        HelpContent defaultHelp = new HelpContent();
        defaultHelp.setTitle("General Help");
        defaultHelp.setShortDescription("For assistance, please contact support or refer to the user manual.");
        defaultHelp.setDetailedContent("No specific help available for this field. Please refer to the general documentation or contact support.");
        return defaultHelp;
    }
}
