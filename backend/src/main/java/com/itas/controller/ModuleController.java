package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Course;
import com.itas.model.Module;
import com.itas.repository.CourseRepository;
import com.itas.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/modules")
public class ModuleController {
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @GetMapping("")
    public ResponseEntity<?> getAllModules() {
        try {
            List<Module> modules = moduleRepository.findAll();
            return ResponseEntity.ok(new ApiResponse<>("Success", modules));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to load modules: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getModuleById(@PathVariable Long id) {
        try {
            Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));
            return ResponseEntity.ok(new ApiResponse<>("Success", module));
        } catch (Exception e) {
            return ResponseEntity.status(404)
                .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getModulesByCourse(@PathVariable Long courseId) {
        try {
            List<Module> modules = moduleRepository.findByCourseIdOrderByOrderAsc(courseId);
            return ResponseEntity.ok(new ApiResponse<>("Success", modules));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to load modules: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN', 'TRAINING_ADMIN')")
    public ResponseEntity<?> createModule(@RequestBody Map<String, Object> request) {
        try {
            Long courseId = ((Number) request.get("courseId")).longValue();
            String title = (String) request.get("title");
            String description = (String) request.get("description");
            Integer orderIndex = request.get("orderIndex") != null ? 
                ((Number) request.get("orderIndex")).intValue() : 0;
            Integer durationMinutes = request.get("durationMinutes") != null ? 
                ((Number) request.get("durationMinutes")).intValue() : 60;
            String contentUrl = request.get("contentUrl") != null ? 
                (String) request.get("contentUrl") : null;
            String videoUrl = request.get("videoUrl") != null ? 
                (String) request.get("videoUrl") : null;
            
            Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
            
            Module module = new Module();
            module.setCourse(course);
            module.setTitle(title);
            module.setDescription(description);
            module.setOrder(orderIndex);
            module.setDurationMinutes(durationMinutes);
            module.setContentUrl(contentUrl);
            module.setVideoUrl(videoUrl);
            module.setCreatedAt(LocalDateTime.now());
            module.setUpdatedAt(LocalDateTime.now());
            
            Module savedModule = moduleRepository.save(module);
            return ResponseEntity.ok(new ApiResponse<>("Module created successfully", savedModule));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to create module: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN', 'TRAINING_ADMIN')")
    public ResponseEntity<?> updateModule(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));
            
            if (request.containsKey("title")) {
                module.setTitle((String) request.get("title"));
            }
            if (request.containsKey("description")) {
                module.setDescription((String) request.get("description"));
            }
            if (request.containsKey("orderIndex")) {
                module.setOrder(((Number) request.get("orderIndex")).intValue());
            }
            if (request.containsKey("durationMinutes")) {
                module.setDurationMinutes(((Number) request.get("durationMinutes")).intValue());
            }
            if (request.containsKey("contentUrl")) {
                module.setContentUrl((String) request.get("contentUrl"));
            }
            if (request.containsKey("videoUrl")) {
                module.setVideoUrl((String) request.get("videoUrl"));
            }
            
            module.setUpdatedAt(LocalDateTime.now());
            Module updated = moduleRepository.save(module);
            
            return ResponseEntity.ok(new ApiResponse<>("Module updated successfully", updated));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to update module: " + e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> deleteModule(@PathVariable Long id) {
        try {
            moduleRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>("Module deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to delete module: " + e.getMessage(), null));
        }
    }
}
