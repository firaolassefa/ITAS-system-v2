package com.itas.service;

import com.itas.model.Answer;
import com.itas.model.Module;
import com.itas.model.Question;
import com.itas.model.QuestionType;
import com.itas.repository.ModuleRepository;
import com.itas.repository.QuestionRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class QuestionImportService {

    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private ModuleRepository moduleRepository;

    /**
     * Import questions from Word or PDF file
     */
    public List<Question> importQuestionsFromFile(MultipartFile file, Long moduleId,
                                                   Long courseId, String questionCategory) throws IOException {
        String filename = file.getOriginalFilename();
        String text;

        if (filename != null && filename.endsWith(".docx")) {
            text = extractTextFromWord(file);
        } else if (filename != null && (filename.endsWith(".pdf"))) {
            text = extractTextFromPDF(file);
        } else {
            throw new IllegalArgumentException("Unsupported file format. Please upload .docx or .pdf file");
        }

        String category = questionCategory != null ? questionCategory : "QUIZ";
        List<Question> questions = parseQuestions(text, moduleId, courseId, category);

        if (questions.isEmpty()) {
            throw new RuntimeException(
                "No valid questions found in the file. " +
                "Make sure each question starts with 'Question N:' and has at least 2 options and a 'Correct Answer:' line."
            );
        }

        return questionRepository.saveAll(questions);
    }

    // Keep old signature for backward compatibility
    public List<Question> importQuestionsFromFile(MultipartFile file, Long moduleId) throws IOException {
        return importQuestionsFromFile(file, moduleId, null, "QUIZ");
    }

    /**
     * Extract text from Word document
     */
    private String extractTextFromWord(MultipartFile file) throws IOException {
        StringBuilder text = new StringBuilder();
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                text.append(paragraph.getText()).append("\n");
            }
        }
        return text.toString();
    }

    /**
     * Extract text from PDF document
     */
    private String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            stripper.setLineSeparator("\n");
            String raw = stripper.getText(document);

            // Normalize common PDF extraction issues:
            // 1. Normalize line endings
            raw = raw.replace("\r\n", "\n").replace("\r", "\n");
            // 2. Collapse 3+ blank lines into 2
            raw = raw.replaceAll("\n{3,}", "\n\n");
            // 3. Fix "Question1:" → "Question 1:" (no space between word and number)
            raw = raw.replaceAll("(?i)\\bQuestion(\\d+)", "Question $1");
            // 4. Ensure "Correct Answer:" is on its own line
            raw = raw.replaceAll("(?i)(?<!\n)(Correct\\s+Answer:)", "\nCorrect Answer:");
            // 5. Ensure "Explanation:" is on its own line
            raw = raw.replaceAll("(?i)(?<!\n)(Explanation:)", "\nExplanation:");
            // 6. Ensure "Points:" is on its own line
            raw = raw.replaceAll("(?i)(?<!\n)(Points:)", "\nPoints:");

            return raw;
        }
    }

    /**
     * Parse questions from extracted text.
     * Skips malformed blocks and continues with the rest.
     */
    private List<Question> parseQuestions(String text, Long moduleId, Long courseId, String questionCategory) {
        List<Question> questions = new ArrayList<>();

        Module module = null;
        if (moduleId != null) {
            module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + moduleId));
            if (courseId == null && module.getCourse() != null) {
                courseId = module.getCourse().getId();
            }
        }

        // Split by "Question X:" pattern (flexible: Question 1:, Question 1., Q1:, etc.)
        String[] blocks = text.split("(?i)(?:Question\\s+\\d+[:.)]|Q\\s*\\d+[:.)])");

        int order = questionRepository.findAll().size();
        int skipped = 0;

        for (int i = 1; i < blocks.length; i++) {
            String block = blocks[i].trim();
            if (block.isEmpty()) continue;
            try {
                Question question = parseQuestionBlock(block, module, courseId, questionCategory, order + i);
                if (question != null) {
                    questions.add(question);
                } else {
                    skipped++;
                }
            } catch (Exception e) {
                skipped++;
                System.err.println("Skipped question block " + i + ": " + e.getMessage());
            }
        }

        if (skipped > 0) {
            System.out.println("Import summary: " + questions.size() + " imported, " + skipped + " skipped");
        }

        return questions;
    }

    /**
     * Parse a single question block
     */
    private Question parseQuestionBlock(String block, Module module, Long courseId,
                                         String questionCategory, int order) {
        Question question = new Question();
        if (module != null) question.setModule(module);
        if (courseId != null) question.setCourseId(courseId);
        question.setQuestionType(QuestionType.MULTIPLE_CHOICE);
        question.setQuestionCategory(questionCategory != null ? questionCategory : "QUIZ");
        question.setIsPractice("PRACTICE".equals(questionCategory));
        question.setOrder(order);

        // Extract question text (first line before options)
        String[] lines = block.split("\n");
        StringBuilder questionText = new StringBuilder();
        List<String> options = new ArrayList<>();
        String correctAnswerLetter = null;
        String explanation = null;
        Integer points = 1; // Default points
        String questionTypeStr = null;

        boolean readingQuestion = true;
        
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;

            // Check for Type field (Practice or Exam)
            if (line.matches("(?i)^Type:.*")) {
                questionTypeStr = line.replaceFirst("(?i)^Type:\\s*", "").trim().toUpperCase();
                continue;
            }
            // Check for options (A), B), C), D) or A., B., C., D.
            else if (line.matches("^[A-D][).)].*")) {
                readingQuestion = false;
                options.add(line);
            }
            // Check for correct answer
            else if (line.matches("(?i)^Correct\\s+Answer:.*")) {
                correctAnswerLetter = extractCorrectAnswerLetter(line);
            }
            // Check for explanation
            else if (line.matches("(?i)^Explanation:.*")) {
                explanation = line.replaceFirst("(?i)^Explanation:\\s*", "").trim();
            }
            // Check for points
            else if (line.matches("(?i)^Points:.*")) {
                points = extractPoints(line);
            }
            // Still reading question text
            else if (readingQuestion) {
                if (questionText.length() > 0) questionText.append(" ");
                questionText.append(line);
            }
        }

        // Validate required fields
        if (questionText.length() == 0 || options.size() < 2 || correctAnswerLetter == null) {
            System.err.println("Invalid question format - missing required fields");
            return null;
        }

        // Set question type based on Type field
        if (questionTypeStr != null) {
            if (questionTypeStr.contains("PRACTICE")) {
                question.setQuestionCategory("PRACTICE");
                question.setIsPractice(true);
            } else if (questionTypeStr.contains("FINALEXAM") || questionTypeStr.contains("FINAL_EXAM") || questionTypeStr.contains("FINAL")) {
                question.setQuestionCategory("FINAL_EXAM");
                question.setIsPractice(false);
            } else {
                question.setQuestionCategory("QUIZ");
                question.setIsPractice(false);
            }
        }

        // Set question properties
        question.setQuestionText(questionText.toString());
        question.setExplanation(explanation);
        question.setPoints(points);

        // Create Answer entities for each option
        List<Answer> answers = new ArrayList<>();
        for (int i = 0; i < options.size(); i++) {
            Answer answer = new Answer();
            answer.setQuestion(question);
            answer.setAnswerText(options.get(i));
            answer.setOrder(i + 1);
            
            // Check if this is the correct answer
            String optionLetter = options.get(i).substring(0, 1).toUpperCase();
            answer.setIsCorrect(optionLetter.equals(correctAnswerLetter));
            
            answers.add(answer);
        }
        
        question.setAnswers(answers);

        return question;
    }

    /**
     * Extract correct answer letter from line
     * Supports formats: "Correct Answer: A", "Correct Answer: A)", "Correct Answer: A."
     */
    private String extractCorrectAnswerLetter(String line) {
        Pattern pattern = Pattern.compile("(?i)Correct\\s+Answer:\\s*([A-D])", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(line);
        
        if (matcher.find()) {
            return matcher.group(1).toUpperCase();
        }
        
        return null;
    }

    /**
     * Extract points from line
     */
    private Integer extractPoints(String line) {
        Pattern pattern = Pattern.compile("(?i)Points:\\s*(\\d+)");
        Matcher matcher = pattern.matcher(line);
        
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        
        return 1; // Default
    }

    /**
     * Preview questions from file without saving
     */
    public List<Question> previewQuestionsFromFile(MultipartFile file, Long moduleId) throws IOException {
        String filename = file.getOriginalFilename();
        String text;

        if (filename != null && filename.endsWith(".docx")) {
            text = extractTextFromWord(file);
        } else if (filename != null && (filename.endsWith(".pdf"))) {
            text = extractTextFromPDF(file);
        } else {
            throw new IllegalArgumentException("Unsupported file format. Please upload .docx or .pdf file");
        }

        return parseQuestions(text, moduleId, null, "QUIZ");
    }
}
