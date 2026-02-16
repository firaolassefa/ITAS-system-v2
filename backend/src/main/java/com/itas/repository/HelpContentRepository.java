package com.itas.repository;

import com.itas.model.HelpContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface HelpContentRepository extends JpaRepository<HelpContent, Long> {
    
    Optional<HelpContent> findByFieldId(String fieldId);
    
    Optional<HelpContent> findByFieldName(String fieldName);
    
    List<HelpContent> findByCategory(String category);
    
    @Query("SELECT h FROM HelpContent h WHERE " +
           "LOWER(h.fieldName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.example) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<HelpContent> search(@Param("query") String query);
    
    @Query("SELECT h FROM HelpContent h WHERE " +
           "LOWER(h.fieldName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(h.example) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<HelpContent> searchByKeyword(@Param("keyword") String keyword);
}