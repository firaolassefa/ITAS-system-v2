package com.itas.service;

import com.itas.model.Resource;
import com.itas.model.User;
import com.itas.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ResourceService {
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;
    
    public List<Resource> getAllResources(String category, String resourceType, String audience) {
        List<Resource> resources = resourceRepository.findAll();
        
        if (category != null) {
            resources = resources.stream()
                    .filter(r -> category.equals(r.getCategory()))
                    .collect(Collectors.toList());
        }
        
        if (resourceType != null) {
            resources = resources.stream()
                    .filter(r -> resourceType.equals(r.getResourceType()))
                    .collect(Collectors.toList());
        }
        
        if (audience != null) {
            resources = resources.stream()
                    .filter(r -> audience.equals(r.getAudience()))
                    .collect(Collectors.toList());
        }
        
        return resources;
    }
    
    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id).orElse(null);
    }
    
    public List<Resource> searchResources(String query, String category, String resourceType, String audience) {
        List<Resource> resources;
        
        if (query != null && !query.isEmpty()) {
            resources = resourceRepository.searchByKeyword(query);
        } else {
            resources = resourceRepository.findAll();
        }
        
        if (category != null) {
            resources = resources.stream()
                    .filter(r -> category.equals(r.getCategory()))
                    .collect(Collectors.toList());
        }
        
        if (resourceType != null) {
            resources = resources.stream()
                    .filter(r -> resourceType.equals(r.getResourceType()))
                    .collect(Collectors.toList());
        }
        
        if (audience != null) {
            resources = resources.stream()
                    .filter(r -> audience.equals(r.getAudience()))
                    .collect(Collectors.toList());
        }
        
        return resources;
    }
    
    @Transactional
    public Resource createResource(Resource resource) {
        resource.setUploadedAt(LocalDateTime.now());
        resource.setViewCount(0);
        resource.setDownloadCount(0);
        return resourceRepository.save(resource);
    }
    
    @Transactional
    public Resource updateResource(Long id, Resource resourceDetails) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        resource.setTitle(resourceDetails.getTitle());
        resource.setDescription(resourceDetails.getDescription());
        resource.setResourceType(resourceDetails.getResourceType());
        resource.setCategory(resourceDetails.getCategory());
        resource.setAudience(resourceDetails.getAudience());
        resource.setStatus(resourceDetails.getStatus());
        resource.setUpdatedAt(LocalDateTime.now());
        
        return resourceRepository.save(resource);
    }
    
    @Transactional
    public Resource uploadResource(MultipartFile file, Resource resource, User uploader) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Set resource properties
        resource.setFileName(originalFilename);
        resource.setFilePath(filePath.toString());
        resource.setFileSize(file.getSize());
        resource.setMimeType(file.getContentType());
        resource.setUploadedBy(uploader);
        resource.setUploadedAt(LocalDateTime.now());
        resource.setViewCount(0);
        resource.setDownloadCount(0);
        
        return resourceRepository.save(resource);
    }
    
    @Transactional
    public Resource updateResource(Long id, MultipartFile file, Resource resourceDetails, User updater) throws IOException {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        // Update basic properties
        resource.setTitle(resourceDetails.getTitle());
        resource.setDescription(resourceDetails.getDescription());
        resource.setResourceType(resourceDetails.getResourceType());
        resource.setCategory(resourceDetails.getCategory());
        resource.setAudience(resourceDetails.getAudience());
        resource.setUpdatedAt(LocalDateTime.now());
        
        // Update file if provided
        if (file != null && !file.isEmpty()) {
            // Delete old file
            if (resource.getFilePath() != null) {
                try {
                    Files.deleteIfExists(Paths.get(resource.getFilePath()));
                } catch (IOException e) {
                    // Log error but continue
                }
            }
            
            // Upload new file
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : "";
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            resource.setFileName(originalFilename);
            resource.setFilePath(filePath.toString());
            resource.setFileSize(file.getSize());
            resource.setMimeType(file.getContentType());
        }
        
        return resourceRepository.save(resource);
    }
    
    @Transactional
    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        // Delete file
        if (resource.getFilePath() != null) {
            try {
                Files.deleteIfExists(Paths.get(resource.getFilePath()));
            } catch (IOException e) {
                // Log error but continue
            }
        }
        
        resourceRepository.delete(resource);
    }
    
    @Transactional
    public void incrementViewCount(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        resource.setViewCount(resource.getViewCount() + 1);
        resourceRepository.save(resource);
    }
    
    @Transactional
    public void incrementDownloadCount(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        resource.setDownloadCount(resource.getDownloadCount() + 1);
        resourceRepository.save(resource);
    }
    
    public List<Resource> getPopularResources(int limit) {
        return resourceRepository.findAll().stream()
                .sorted((r1, r2) -> Integer.compare(r2.getDownloadCount(), r1.getDownloadCount()))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
