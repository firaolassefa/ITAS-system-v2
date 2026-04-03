package com.itas.repository;

import com.itas.model.Course;
import com.itas.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    @Query(value = "SELECT * FROM modules WHERE course_id = :courseId ORDER BY module_order ASC", nativeQuery = true)
    List<Module> findByCourseIdOrderByModuleOrderAsc(@Param("courseId") Long courseId);

    @Query(value = "SELECT m.* FROM modules m WHERE m.course_id = :#{#course.id} ORDER BY m.module_order ASC", nativeQuery = true)
    List<Module> findByCourseOrderByModuleOrderAsc(@Param("course") Course course);
    long countByCourseId(Long courseId);

    @Modifying
    @Transactional
    @Query("UPDATE Module m SET m.videoUrl = :url, m.updatedAt = CURRENT_TIMESTAMP WHERE m.id = :id")
    void updateVideoUrl(@Param("id") Long id, @Param("url") String url);

    @Modifying
    @Transactional
    @Query("UPDATE Module m SET m.contentUrl = :url, m.updatedAt = CURRENT_TIMESTAMP WHERE m.id = :id")
    void updateContentUrl(@Param("id") Long id, @Param("url") String url);
}
