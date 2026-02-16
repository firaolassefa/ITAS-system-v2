package com.itas.repository;

import com.itas.model.Assessment;
import com.itas.model.Module;
import com.itas.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByUserAndModuleOrderByAttemptNumberDesc(User user, Module module);
    List<Assessment> findByUserIdAndModuleIdOrderByAttemptNumberDesc(Long userId, Long moduleId);
    
    @Query("SELECT COUNT(a) FROM Assessment a WHERE a.user = ?1 AND a.module = ?2")
    Integer countAttemptsByUserAndModule(User user, Module module);
    
    @Query("SELECT a FROM Assessment a WHERE a.user = ?1 AND a.module = ?2 AND a.passed = true")
    Optional<Assessment> findPassedAssessment(User user, Module module);
}
