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
    public List<Question> importQuestionsFromFile(MultipartFile file, Long moduleId) throws IOException {
        String filename = file.getOriginalFilename();
        String text;

        if (filename != null && filename.endsWith(".docx")) {
            text = extractTextFromWord(file);
        } else if (filename != null && (filename.endsWith(".pdf"))) {
            text = extractTextFromPDF(file);
        } else {
            throw new IllegalArgumentException("Unsupported file format. Please upload .docx or .pdf file");
        }

        List<Question> questions = parseQuestions(text, moduleId);
        return questionRepository.saveAll(questions);
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
            return stripper.getText(document);
        }
    }

    /**
     * Parse questions from extracted text
     * Expected format:
     * Question 1: What is VAT?
     * Type: Practice (or Exam)
     * A) Value Added Tax
     * B) Variable Annual Tax
     * C) Verified Asset Tax
     * D) None of the above
     * Correct Answer: A
     * Explanation: VAT stands for Value Added Tax (optional)
     * Points: 10 (optional, default 1)
     */
    private List<Question> parseQuestions(String text, Long moduleId) {
        List<Question> questions = new ArrayList<>();
        
        // Get module
        Module module = moduleRepository.findById(moduleId)
            .orElseThrow(() -> new RuntimeException("Module not found with id: " + moduleId));
        
        // Split by "Question X:" pattern
        String[] blocks = text.split("(?i)Question\\s+\\d+:");
        
        int order = 1;
        for (int i = 1; i < blocks.length; i++) {
            String block = blocks[i].trim();
            if (block.isEmpty()) continue;

            try {
                Question question = parseQuestionBlock(block, module, order);
                if (question != null) {
                    questions.add(question);
                    order++;
                }
            } catch (Exception e) {
                System.err.println("Failed to parse question block: " + e.getMessage());
                // Continue with next question
            }
        }

        return questions;
    }

    /**
     * Parse a single question block
     */
    private Question parseQuestionBlock(String block, Module module, int order) {
        Question question = new Question();
        question.setModule(module);
        question.setQuestionType(QuestionType.MULTIPLE_CHOICE);
        question.setIsPractice(false); // Default to exam question
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
        if (questionTypeStr != null && questionTypeStr.contains("PRACTICE")) {
            question.setIsPractice(true);
        } else {
            question.setIsPractice(false); // Exam question
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

        // Get module
        Module module = moduleRepository.findById(moduleId)
            .orElseThrow(() -> new RuntimeException("Module not found with id: " + moduleId));

        return parseQuestions(text, moduleId);
    }
}
