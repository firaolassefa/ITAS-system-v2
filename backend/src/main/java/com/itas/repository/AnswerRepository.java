package com.itas.repository;

import com.itas.model.Answer;
import com.itas.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionOrderByOrderAsc(Question question);
    List<Answer> findByQuestionIdOrderByOrderAsc(Long questionId);
}
