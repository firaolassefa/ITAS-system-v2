package com.itas.repository;

import com.itas.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    List<Enrollment> findByCourseId(Long courseId);
    Enrollment findByUserIdAndCourseId(Long userId, Long courseId);
    
    // Dashboard methods
    long countByUserId(Long userId);
    long countByUserIdAndProgressGreaterThanEqual(Long userId, int progress);
    long countByProgressGreaterThanEqual(int progress);
    
    @Query("SELECT AVG(e.progress) FROM Enrollment e WHERE e.userId = :userId")
    Double findAverageProgressByUserId(@Param("userId") Long userId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.userId = :userId AND e.progress < :progress")
    List<Enrollment> findByUserIdAndProgressLessThan(@Param("userId") Long userId, @Param("progress") int progress);
}
