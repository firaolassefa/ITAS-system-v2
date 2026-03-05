package com.itas.repository;

import com.itas.model.AssessmentDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentDefinitionRepository extends JpaRepository<AssessmentDefinition, Long> {
    
    // Find all assessments for a course
    List<AssessmentDefinition> findByCourseId(Long courseId);
    
    // Find all assessments for a module
    List<AssessmentDefinition> findByModuleId(Long moduleId);
    
    // Find final exam for a course
    Optional<AssessmentDefinition> findByCourseIdAndIsFinalExam(Long courseId, Boolean isFinalExam);
    
    // Find assessments by type
    List<AssessmentDefinition> findByCourseIdAndAssessmentType(Long courseId, String assessmentType);
    
    // Find module quizzes for a course
    List<AssessmentDefinition> findByCourseIdAndIsFinalExam(Long courseId, boolean isFinalExam);
    
    // Check if final exam exists for course
    boolean existsByCourseIdAndIsFinalExam(Long courseId, Boolean isFinalExam);
}
