package com.itas.repository;

import com.itas.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByPublishedTrue();
    
    // Dashboard methods
    @Query("SELECT c FROM Course c LEFT JOIN Enrollment e ON c.id = e.courseId GROUP BY c.id")
    List<Course> findAllWithEnrollmentStats();
}
