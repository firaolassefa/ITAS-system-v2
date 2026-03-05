package com.itas.repository;

import com.itas.model.AssessmentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, Long> {
    
    // Find all attempts by user and assessment
    List<AssessmentAttempt> findByUserIdAndAssessmentDefinitionId(Long userId, Long assessmentDefinitionId);
    
    // Count attempts by user and assessment
    @Query("SELECT COUNT(a) FROM AssessmentAttempt a WHERE a.userId = ?1 AND a.assessmentDefinitionId = ?2")
    Integer countByUserIdAndAssessmentDefinitionId(Long userId, Long assessmentDefinitionId);
    
    // Find latest attempt
    Optional<AssessmentAttempt> findTopByUserIdAndAssessmentDefinitionIdOrderByAttemptNumberDesc(
        Long userId, Long assessmentDefinitionId);
    
    // Find best attempt (highest score)
    Optional<AssessmentAttempt> findTopByUserIdAndAssessmentDefinitionIdOrderByPercentageDesc(
        Long userId, Long assessmentDefinitionId);
    
    // Find all passed attempts
    List<AssessmentAttempt> findByUserIdAndAssessmentDefinitionIdAndPassed(
        Long userId, Long assessmentDefinitionId, Boolean passed);
    
    // Check if user has passed
    boolean existsByUserIdAndAssessmentDefinitionIdAndPassed(
        Long userId, Long assessmentDefinitionId, Boolean passed);
}
