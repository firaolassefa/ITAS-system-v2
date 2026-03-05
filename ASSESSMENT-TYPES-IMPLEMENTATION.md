# Assessment Types Implementation - Module Quiz vs Final Exam

## Overview
Implement two types of assessments:
1. **Module Quiz** - Practice quizzes for learning (unlimited attempts, no certificate)
2. **Final Exam** - Certification exam (limited attempts, required for certificate)

---

## Database Changes

### 1. Create New Tables

#### `assessment_definitions` table (NEW)
```sql
CREATE TABLE assessment_definitions (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    module_id BIGINT NULL,  -- NULL for final exam
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(50) NOT NULL,  -- 'MODULE_QUIZ' or 'FINAL_EXAM'
    is_final_exam BOOLEAN DEFAULT FALSE,
    passing_score DOUBLE PRECISION DEFAULT 70.0,
    max_attempts INTEGER DEFAULT 999,  -- 999 = unlimited
    time_limit_minutes INTEGER DEFAULT 60,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    certificate_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (module_id) REFERENCES modules(id)
);
```

#### `assessment_attempts` table (NEW)
```sql
CREATE TABLE assessment_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    assessment_definition_id BIGINT NOT NULL,
    attempt_number INTEGER NOT NULL,
    score DOUBLE PRECISION,
    total_points DOUBLE PRECISION,
    percentage DOUBLE PRECISION,
    passed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    time_taken_minutes INTEGER,
    answers JSONB,  -- Store user answers
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assessment_definition_id) REFERENCES assessment_definitions(id),
    UNIQUE(user_id, assessment_definition_id, attempt_number)
);
```

### 2. Update Existing Tables

#### `certificates` table
```sql
ALTER TABLE certificates 
ADD COLUMN final_exam_id BIGINT,
ADD COLUMN final_exam_score DOUBLE PRECISION,
ADD COLUMN final_exam_passed_at TIMESTAMP;
```

---

## Backend Implementation

### 1. Create New Models

#### `AssessmentDefinition.java`
```java
@Entity
@Table(name = "assessment_definitions")
public class AssessmentDefinition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "course_id")
    private Long courseId;
    
    @Column(name = "module_id")
    private Long moduleId;  // NULL for final exam
    
    private String title;
    private String description;
    
    @Column(name = "assessment_type")
    private String assessmentType;  // MODULE_QUIZ or FINAL_EXAM
    
    @Column(name = "is_final_exam")
    private Boolean isFinalExam = false;
    
    @Column(name = "passing_score")
    private Double passingScore = 70.0;
    
    @Column(name = "max_attempts")
    private Integer maxAttempts = 999;
    
    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes = 60;
    
    @Column(name = "show_correct_answers")
    private Boolean showCorrectAnswers = true;
    
    @Column(name = "certificate_required")
    private Boolean certificateRequired = false;
    
    // Getters and setters...
}
```

#### `AssessmentAttempt.java`
```java
@Entity
@Table(name = "assessment_attempts")
public class AssessmentAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "assessment_definition_id")
    private Long assessmentDefinitionId;
    
    @Column(name = "attempt_number")
    private Integer attemptNumber;
    
    private Double score;
    
    @Column(name = "total_points")
    private Double totalPoints;
    
    private Double percentage;
    private Boolean passed = false;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "time_taken_minutes")
    private Integer timeTakenMinutes;
    
    @Column(columnDefinition = "jsonb")
    private String answers;  // JSON string
    
    // Getters and setters...
}
```

### 2. Create Repositories

```java
public interface AssessmentDefinitionRepository extends JpaRepository<AssessmentDefinition, Long> {
    List<AssessmentDefinition> findByCourseId(Long courseId);
    List<AssessmentDefinition> findByModuleId(Long moduleId);
    Optional<AssessmentDefinition> findByCourseIdAndIsFinalExam(Long courseId, Boolean isFinalExam);
    List<AssessmentDefinition> findByCourseIdAndAssessmentType(Long courseId, String assessmentType);
}

public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, Long> {
    List<AssessmentAttempt> findByUserIdAndAssessmentDefinitionId(Long userId, Long assessmentDefinitionId);
    Integer countByUserIdAndAssessmentDefinitionId(Long userId, Long assessmentDefinitionId);
    Optional<AssessmentAttempt> findTopByUserIdAndAssessmentDefinitionIdOrderByAttemptNumberDesc(Long userId, Long assessmentDefinitionId);
}
```

### 3. Create Service

```java
@Service
public class AssessmentService {
    
    // Create assessment definition
    public AssessmentDefinition createAssessment(AssessmentDefinition assessment) {
        // Validate
        if (assessment.getIsFinalExam()) {
            // Check if final exam already exists for this course
            Optional<AssessmentDefinition> existing = 
                assessmentDefinitionRepository.findByCourseIdAndIsFinalExam(
                    assessment.getCourseId(), true);
            if (existing.isPresent()) {
                throw new RuntimeException("Final exam already exists for this course");
            }
            // Set final exam defaults
            assessment.setAssessmentType("FINAL_EXAM");
            assessment.setMaxAttempts(3);
            assessment.setShowCorrectAnswers(false);
            assessment.setCertificateRequired(true);
            assessment.setModuleId(null);  // Final exam not tied to module
        } else {
            assessment.setAssessmentType("MODULE_QUIZ");
            assessment.setMaxAttempts(999);  // Unlimited
            assessment.setShowCorrectAnswers(true);
            assessment.setCertificateRequired(false);
        }
        return assessmentDefinitionRepository.save(assessment);
    }
    
    // Start assessment attempt
    public AssessmentAttempt startAttempt(Long userId, Long assessmentDefinitionId) {
        AssessmentDefinition definition = assessmentDefinitionRepository
            .findById(assessmentDefinitionId)
            .orElseThrow(() -> new RuntimeException("Assessment not found"));
        
        // Check attempt limit
        Integer attemptCount = assessmentAttemptRepository
            .countByUserIdAndAssessmentDefinitionId(userId, assessmentDefinitionId);
        
        if (attemptCount >= definition.getMaxAttempts()) {
            throw new RuntimeException("Maximum attempts reached");
        }
        
        // Create new attempt
        AssessmentAttempt attempt = new AssessmentAttempt();
        attempt.setUserId(userId);
        attempt.setAssessmentDefinitionId(assessmentDefinitionId);
        attempt.setAttemptNumber(attemptCount + 1);
        attempt.setStartedAt(LocalDateTime.now());
        
        return assessmentAttemptRepository.save(attempt);
    }
    
    // Submit assessment
    public AssessmentAttempt submitAttempt(Long attemptId, Map<Long, String> answers) {
        AssessmentAttempt attempt = assessmentAttemptRepository
            .findById(attemptId)
            .orElseThrow(() -> new RuntimeException("Attempt not found"));
        
        AssessmentDefinition definition = assessmentDefinitionRepository
            .findById(attempt.getAssessmentDefinitionId())
            .orElseThrow(() -> new RuntimeException("Assessment not found"));
        
        // Calculate score
        // ... scoring logic ...
        
        attempt.setCompletedAt(LocalDateTime.now());
        attempt.setPassed(attempt.getPercentage() >= definition.getPassingScore());
        
        // If final exam passed, generate certificate
        if (definition.getIsFinalExam() && attempt.getPassed()) {
            generateCertificate(attempt.getUserId(), definition.getCourseId(), attempt);
        }
        
        return assessmentAttemptRepository.save(attempt);
    }
    
    // Generate certificate
    private void generateCertificate(Long userId, Long courseId, AssessmentAttempt attempt) {
        Certificate certificate = new Certificate();
        certificate.setUserId(userId);
        certificate.setCourseId(courseId);
        certificate.setFinalExamId(attempt.getAssessmentDefinitionId());
        certificate.setFinalExamScore(attempt.getPercentage());
        certificate.setFinalExamPassedAt(attempt.getCompletedAt());
        certificate.setIssuedAt(LocalDateTime.now());
        certificateRepository.save(certificate);
    }
}
```

---

## Frontend Implementation

### 1. Assessment Creation Form

```typescript
interface AssessmentForm {
  title: string;
  description: string;
  assessmentType: 'MODULE_QUIZ' | 'FINAL_EXAM';
  courseId: number;
  moduleId?: number;  // Only for module quiz
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes: number;
  showCorrectAnswers: boolean;
}

// Component
const CreateAssessment = () => {
  const [type, setType] = useState<'MODULE_QUIZ' | 'FINAL_EXAM'>('MODULE_QUIZ');
  
  return (
    <form>
      <FormControl>
        <FormLabel>Assessment Type</FormLabel>
        <RadioGroup value={type} onChange={(e) => setType(e.target.value)}>
          <FormControlLabel 
            value="MODULE_QUIZ" 
            control={<Radio />} 
            label="Module Quiz (Practice)" 
          />
          <FormControlLabel 
            value="FINAL_EXAM" 
            control={<Radio />} 
            label="Final Exam (For Certificate)" 
          />
        </RadioGroup>
      </FormControl>
      
      {type === 'MODULE_QUIZ' && (
        <FormControl>
          <InputLabel>Module</InputLabel>
          <Select>
            {/* Module options */}
          </Select>
        </FormControl>
      )}
      
      <TextField label="Title" />
      <TextField label="Description" multiline />
      <TextField 
        label="Passing Score (%)" 
        type="number" 
        defaultValue={70} 
      />
      <TextField 
        label="Max Attempts" 
        type="number" 
        defaultValue={type === 'FINAL_EXAM' ? 3 : 999} 
        disabled={type === 'MODULE_QUIZ'}
      />
      <TextField 
        label="Time Limit (minutes)" 
        type="number" 
        defaultValue={60} 
      />
      
      <Button type="submit">Create Assessment</Button>
    </form>
  );
};
```

### 2. Student Course View

```typescript
const CourseModules = ({ courseId }) => {
  return (
    <Box>
      {modules.map(module => (
        <Accordion key={module.id}>
          <AccordionSummary>
            <Typography>{module.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Module content */}
            
            {/* Module Quiz */}
            {module.quiz && (
              <Card>
                <CardContent>
                  <Chip label="Practice Quiz" color="info" />
                  <Typography>{module.quiz.title}</Typography>
                  <Typography variant="caption">
                    Unlimited attempts • Immediate feedback
                  </Typography>
                  <Button>Start Quiz</Button>
                </CardContent>
              </Card>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
      
      {/* Final Exam */}
      <Card sx={{ mt: 3, border: '2px solid gold' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmojiEvents sx={{ fontSize: 40, color: 'gold' }} />
            <Box>
              <Chip label="Final Exam" color="warning" />
              <Typography variant="h6">Course Final Exam</Typography>
              <Typography variant="caption">
                Pass to earn certificate • {finalExam.maxAttempts} attempts • 
                {finalExam.passingScore}% required
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" color="warning">
            Take Final Exam
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
```

---

## File Import Feature (Bonus)

### 1. Backend - File Parser

```java
@Service
public class QuestionImportService {
    
    public List<Question> importFromFile(MultipartFile file) {
        String filename = file.getOriginalFilename();
        
        if (filename.endsWith(".docx")) {
            return parseWordDocument(file);
        } else if (filename.endsWith(".pdf")) {
            return parsePdfDocument(file);
        } else if (filename.endsWith(".txt")) {
            return parseTextFile(file);
        }
        
        throw new RuntimeException("Unsupported file format");
    }
    
    private List<Question> parseWordDocument(MultipartFile file) {
        // Use Apache POI to parse .docx
        // Extract questions in format:
        // Question 1: ...
        // A) ...
        // B) ...
        // Correct: A
    }
    
    private List<Question> parsePdfDocument(MultipartFile file) {
        // Use Apache PDFBox to parse PDF
    }
}
```

### 2. Frontend - File Upload

```typescript
const ImportQuestions = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Question[]>([]);
  
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/questions/import', {
      method: 'POST',
      body: formData,
    });
    
    const questions = await response.json();
    setPreview(questions);
  };
  
  return (
    <Box>
      <input 
        type="file" 
        accept=".docx,.pdf,.txt" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <Button onClick={handleUpload}>Upload & Preview</Button>
      
      {preview.length > 0 && (
        <Box>
          <Typography>{preview.length} questions found</Typography>
          {preview.map((q, i) => (
            <Card key={i}>
              <CardContent>
                <Typography>{q.questionText}</Typography>
                {/* Edit/Delete options */}
              </CardContent>
            </Card>
          ))}
          <Button onClick={saveAll}>Save All Questions</Button>
        </Box>
      )}
    </Box>
  );
};
```

---

## Testing Plan

### 1. Module Quiz Testing
- [ ] Create module quiz
- [ ] Take quiz multiple times
- [ ] Verify unlimited attempts
- [ ] Check immediate feedback
- [ ] Verify no certificate generated

### 2. Final Exam Testing
- [ ] Create final exam
- [ ] Verify only one final exam per course
- [ ] Take exam (pass)
- [ ] Verify certificate generated
- [ ] Take exam (fail)
- [ ] Verify no certificate
- [ ] Verify attempt limit (3 attempts)
- [ ] Verify no correct answers shown

### 3. File Import Testing
- [ ] Upload Word document
- [ ] Upload PDF
- [ ] Verify questions extracted
- [ ] Edit imported questions
- [ ] Save to database

---

## Priority

**Phase 1 (HIGH):**
1. Database schema changes
2. Assessment types (Module Quiz vs Final Exam)
3. Certificate logic for final exam
4. Frontend UI for assessment types

**Phase 2 (MEDIUM):**
1. File import for questions
2. Question preview and editing
3. Bulk operations

---

## Summary

This implementation provides:
✅ Clear distinction between practice and certification
✅ Professional assessment structure
✅ Automatic certificate generation
✅ Easy question management via file import
✅ Better learning experience
✅ Industry-standard approach

**Status**: Ready to implement
**Estimated Time**: 4-6 hours for Phase 1, 2-3 hours for Phase 2
**Impact**: HIGH - Critical for proper certification system
