package com.itas.controller;

import com.itas.dto.ApiResponse;
import com.itas.model.Course;
import com.itas.model.Module;
import com.itas.repository.CourseRepository;
import com.itas.repository.ModuleRepository;
import com.itas.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.DataSource;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/modules")
public class ModuleController {
    
    @Autowired
    private ModuleRepository moduleRepository;
    
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private DataSource dataSource;
    
    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;
    
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
            List<Module> modules = moduleRepository.findByCourseIdOrderByModuleOrderAsc(courseId);
            return ResponseEntity.ok(new ApiResponse<>("Success", modules));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>("Failed to load modules: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}/has-quiz")
    public ResponseEntity<?> hasQuiz(@PathVariable Long id) {
        long count = questionRepository.countByModuleIdAndIsPracticeFalse(id);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("hasQuiz", count > 0);
        result.put("questionCount", count);
        return ResponseEntity.ok(new ApiResponse<>("Success", result));
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
            module.setModuleOrder(orderIndex);
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
                module.setModuleOrder(((Number) request.get("orderIndex")).intValue());
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
    
    @GetMapping("/{id}/test")
    public ResponseEntity<?> testEndpoint(@PathVariable Long id) {
        try {
            String sql = "SELECT id, title FROM modules WHERE id = ?";
            try (java.sql.Connection conn = dataSource.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setLong(1, id);
                java.sql.ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    return ResponseEntity.ok(new ApiResponse<>("Module found",
                        java.util.Map.of("id", rs.getLong("id"), "title", rs.getString("title"))));
                }
                return ResponseEntity.status(404).body(new ApiResponse<>("Module not found", null));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>("Error: " + e.getMessage(), null));
        }
    }

    @PostMapping("/{id}/upload-content")
    public ResponseEntity<?> uploadModuleContent(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("contentType") String contentType) {
        
        System.out.println("=== UPLOAD STARTED: module=" + id + " contentType=" + contentType + " file=" + (file != null ? file.getOriginalFilename() : "null") + " size=" + (file != null ? file.getSize() : 0));
        
        try {
            // Verify module exists
            if (!moduleRepository.existsById(id)) {
                return ResponseEntity.status(404)
                    .body(new ApiResponse<>("Module not found with id: " + id, null));
            }
            
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("File is empty", null));
            }
            
            // Create upload directory
            Path uploadPath = Paths.get(uploadDir, "modules");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file to disk
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = "/uploads/modules/" + filename;
            
            // Use native JDBC to update only the specific column — avoids missing column issues
            String column = "video".equalsIgnoreCase(contentType) ? "video_url" : "content_url";
            String sql = "UPDATE modules SET " + column + " = ?, updated_at = NOW() WHERE id = ?";
            
            try (java.sql.Connection conn = dataSource.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, fileUrl);
                ps.setLong(2, id);
                ps.executeUpdate();
            }
            
            java.util.Map<String, Object> result = new java.util.HashMap<>();
            result.put("id", id);
            result.put("fileUrl", fileUrl);
            result.put("contentType", contentType);
            result.put("fileName", originalFilename);
            result.put("fileSize", file.getSize());
            
            return ResponseEntity.ok(new ApiResponse<>("File uploaded successfully", result));
            
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new ApiResponse<>("Failed to save file: " + e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new ApiResponse<>("Upload failed: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/{id}/set-url")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CONTENT_ADMIN', 'TRAINING_ADMIN')")
    public ResponseEntity<?> setModuleUrl(
            @PathVariable Long id,
            @RequestParam("url") String url,
            @RequestParam("urlType") String urlType) {
        
        try {
            if (!moduleRepository.existsById(id)) {
                return ResponseEntity.status(404)
                    .body(new ApiResponse<>("Module not found", null));
            }
            
            if (url == null || url.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("URL is required", null));
            }
            
            String column = "video".equalsIgnoreCase(urlType) ? "video_url" : "content_url";
            String sql = "UPDATE modules SET " + column + " = ?, updated_at = NOW() WHERE id = ?";
            
            try (java.sql.Connection conn = dataSource.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, url);
                ps.setLong(2, id);
                ps.executeUpdate();
            }
            
            return ResponseEntity.ok(new ApiResponse<>("URL set successfully",
                java.util.Map.of("id", id, "url", url, "urlType", urlType)));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new ApiResponse<>("Error: " + e.getMessage(), null));
        }
    }
}

