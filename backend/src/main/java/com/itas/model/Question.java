package com.itas.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "questions", "course"})
    private Module module;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "question_type")
    private QuestionType questionType = QuestionType.MULTIPLE_CHOICE;
    
    @Column(name = "question_order")
    private Integer order;
    
    @Column(nullable = false)
    private Integer points = 1;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "is_practice")
    private Boolean isPractice = false; // false = quiz/exam, true = practice

    // PRACTICE | QUIZ | FINAL_EXAM
    @Column(name = "question_category")
    private String questionCategory = "QUIZ";

    @Column(name = "course_id")
    private Long courseId; // used when questionCategory = FINAL_EXAM

    @Column(columnDefinition = "TEXT")
    private String explanation; // Explanation for practice questions
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"question"})
    private List<Answer> answers = new ArrayList<>();
    
    // Constructors
    public Question() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Module getModule() { return module; }
    public void setModule(Module module) { this.module = module; }
    
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    
    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }
    
    public Integer getOrder() { return order; }
    public void setOrder(Integer order) { this.order = order; }
    
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Boolean getIsPractice() { return isPractice; }
    public void setIsPractice(Boolean isPractice) {
        this.isPractice = isPractice;
        // keep questionCategory in sync
        if (Boolean.TRUE.equals(isPractice)) this.questionCategory = "PRACTICE";
    }

    public String getQuestionCategory() { return questionCategory; }
    public void setQuestionCategory(String questionCategory) {
        this.questionCategory = questionCategory;
        this.isPractice = "PRACTICE".equals(questionCategory);
    }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    
    public List<Answer> getAnswers() { return answers; }
    public void setAnswers(List<Answer> answers) { this.answers = answers; }
}
