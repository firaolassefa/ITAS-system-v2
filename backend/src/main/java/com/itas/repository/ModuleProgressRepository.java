package com.itas.repository;

import com.itas.model.ModuleProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ModuleProgressRepository extends JpaRepository<ModuleProgress, Long> {
    
    List<ModuleProgress> findByEnrollmentId(Long enrollmentId);
    
    Optional<ModuleProgress> findByEnrollmentIdAndModuleName(Long enrollmentId, String moduleName);
    
    List<ModuleProgress> findByEnrollmentIdAndCompletedTrue(Long enrollmentId);
    
    Integer countByEnrollmentIdAndCompletedTrue(Long enrollmentId);
    
    Optional<ModuleProgress> findByUserIdAndModuleId(Long userId, Long moduleId);
}