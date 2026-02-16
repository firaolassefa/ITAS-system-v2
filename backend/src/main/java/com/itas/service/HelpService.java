package com.itas.service;

import com.itas.model.HelpContent;
import com.itas.repository.HelpContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HelpService {
    
    @Autowired
    private HelpContentRepository helpContentRepository;
    
    public List<HelpContent> getAllHelpContent() {
        return helpContentRepository.findAll();
    }
    
    public HelpContent getHelpContentById(Long id) {
        return helpContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Help content not found with id: " + id));
    }
    
    public List<HelpContent> getHelpContentByCategory(String category) {
        return helpContentRepository.findByCategory(category);
    }
    
    public List<HelpContent> searchHelpContent(String keyword) {
        return helpContentRepository.findAll().stream()
                .filter(h -> h.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                           h.getShortDescription().toLowerCase().contains(keyword.toLowerCase()) ||
                           h.getDetailedContent().toLowerCase().contains(keyword.toLowerCase()))
                .toList();
    }
    
    @Transactional
    public HelpContent createHelpContent(HelpContent helpContent) {
        helpContent.setCreatedAt(LocalDateTime.now());
        helpContent.setUpdatedAt(LocalDateTime.now());
        return helpContentRepository.save(helpContent);
    }
    
    @Transactional
    public HelpContent updateHelpContent(Long id, HelpContent helpContentDetails) {
        HelpContent helpContent = getHelpContentById(id);
        
        helpContent.setTitle(helpContentDetails.getTitle());
        helpContent.setCategory(helpContentDetails.getCategory());
        helpContent.setShortDescription(helpContentDetails.getShortDescription());
        helpContent.setDetailedContent(helpContentDetails.getDetailedContent());
        helpContent.setFieldName(helpContentDetails.getFieldName());
        helpContent.setUpdatedAt(LocalDateTime.now());
        
        return helpContentRepository.save(helpContent);
    }
    
    @Transactional
    public void deleteHelpContent(Long id) {
        HelpContent helpContent = getHelpContentById(id);
        helpContentRepository.delete(helpContent);
    }
}
