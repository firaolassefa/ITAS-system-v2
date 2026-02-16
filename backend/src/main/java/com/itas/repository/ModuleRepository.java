package com.itas.repository;

import com.itas.model.Course;
import com.itas.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByCourseOrderByOrderAsc(Course course);
    List<Module> findByCourseIdOrderByOrderAsc(Long courseId);
}
