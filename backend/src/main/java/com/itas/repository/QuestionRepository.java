package com.itas.repository;

import com.itas.model.Module;
import com.itas.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByModuleOrderByOrderAsc(Module module);
    List<Question> findByModuleIdOrderByOrderAsc(Long moduleId);
}
