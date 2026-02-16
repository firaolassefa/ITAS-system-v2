package com.itas.service;

import com.itas.model.ArchivedResource;
import com.itas.model.Resource;
import com.itas.model.User;
import com.itas.repository.ArchivedResourceRepository;
import com.itas.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArchiveService {
    
    @Autowired
    private ArchivedResourceRepository archivedResourceRepository;
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    public List<ArchivedResource> getAllArchivedResources() {
        return archivedResourceRepository.findAll();
    }
    
    public ArchivedResource getArchivedResourceById(Long id) {
        return archivedResourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Archived resource not found with id: " + id));
    }
    
    @Transactional
    public ArchivedResource archiveResource(Long resourceId, String reason, User archivedBy) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        ArchivedResource archivedResource = new ArchivedResource();
        archivedResource.setOriginalResourceId(resourceId);
        archivedResource.setTitle(resource.getTitle());
        archivedResource.setDescription(resource.getDescription());
        archivedResource.setResourceType(resource.getResourceType());
        archivedResource.setCategory(resource.getCategory());
        archivedResource.setArchiveReason(reason);
        archivedResource.setArchivedBy(archivedBy);
        archivedResource.setArchivedAt(LocalDateTime.now());
        
        ArchivedResource saved = archivedResourceRepository.save(archivedResource);
        
        // Delete original resource
        resourceRepository.delete(resource);
        
        return saved;
    }
    
    @Transactional
    public Resource restoreResource(Long archivedResourceId, User restoredBy) {
        ArchivedResource archivedResource = getArchivedResourceById(archivedResourceId);
        
        Resource resource = new Resource();
        resource.setTitle(archivedResource.getTitle());
        resource.setDescription(archivedResource.getDescription());
        resource.setResourceType(archivedResource.getResourceType());
        resource.setCategory(archivedResource.getCategory());
        resource.setUploadedAt(LocalDateTime.now());
        resource.setViewCount(0);
        resource.setDownloadCount(0);
        
        Resource restored = resourceRepository.save(resource);
        
        // Delete archived record
        archivedResourceRepository.delete(archivedResource);
        
        return restored;
    }
    
    @Transactional
    public void deleteArchivedResource(Long id) {
        ArchivedResource archivedResource = getArchivedResourceById(id);
        archivedResourceRepository.delete(archivedResource);
    }
}
