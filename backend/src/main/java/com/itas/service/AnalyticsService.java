package com.itas.service;

import com.itas.model.Course;
import com.itas.model.Enrollment;
import com.itas.model.Resource;
import com.itas.model.User;
import com.itas.repository.CourseRepository;
import com.itas.repository.EnrollmentRepository;
import com.itas.repository.ResourceRepository;
import com.itas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    public Map<String, Object> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        
        // User statistics
        List<User> allUsers = userRepository.findAll();
        data.put("totalUsers", allUsers.size());
        data.put("activeUsers", allUsers.stream().filter(User::isActive).count());
        data.put("newUsers", allUsers.size()); // In real app, filter by date
        
        // Course statistics
        List<Enrollment> allEnrollments = enrollmentRepository.findAll();
        data.put("courseEnrollments", allEnrollments.size());
        
        long completions = allEnrollments.stream()
                .filter(e -> "COMPLETED".equals(e.getStatus()))
                .count();
        data.put("courseCompletions", completions);
        
        // Completion rate
        double completionRate = allEnrollments.isEmpty() ? 0 : 
                (completions * 100.0) / allEnrollments.size();
        data.put("completionRate", Math.round(completionRate * 100.0) / 100.0);
        
        // Average progress
        double avgProgress = allEnrollments.stream()
                .mapToDouble(Enrollment::getProgress)
                .average()
                .orElse(0.0);
        data.put("avgProgress", Math.round(avgProgress * 100.0) / 100.0);
        
        // Resource statistics
        List<Resource> allResources = resourceRepository.findAll();
        int totalDownloads = allResources.stream()
                .mapToInt(Resource::getDownloads)
                .sum();
        data.put("resourceDownloads", totalDownloads);
        
        // Top courses
        List<Course> allCourses = courseRepository.findAll();
        List<Map<String, Object>> topCourses = allCourses.stream()
                .map(course -> {
                    Map<String, Object> courseData = new HashMap<>();
                    courseData.put("id", course.getId());
                    courseData.put("title", course.getTitle());
                    
                    List<Enrollment> courseEnrollments = allEnrollments.stream()
                            .filter(e -> e.getCourseId().equals(course.getId()))
                            .toList();
                    
                    courseData.put("enrollments", courseEnrollments.size());
                    
                    long courseCompletions = courseEnrollments.stream()
                            .filter(e -> "COMPLETED".equals(e.getStatus()))
                            .count();
                    courseData.put("completions", courseCompletions);
                    
                    double courseCompletionRate = courseEnrollments.isEmpty() ? 0 :
                            (courseCompletions * 100.0) / courseEnrollments.size();
                    courseData.put("completionRate", Math.round(courseCompletionRate * 100.0) / 100.0);
                    
                    return courseData;
                })
                .sorted((c1, c2) -> Integer.compare(
                        (Integer) c2.get("enrollments"),
                        (Integer) c1.get("enrollments")
                ))
                .limit(5)
                .collect(Collectors.toList());
        
        data.put("topCourses", topCourses);
        
        return data;
    }
    
    public Map<String, Object> getUserAnalytics(Long userId) {
        Map<String, Object> data = new HashMap<>();
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        data.put("userId", userId);
        data.put("userName", user.getFullName());
        
        List<Enrollment> userEnrollments = enrollmentRepository.findByUserId(userId);
        data.put("totalEnrollments", userEnrollments.size());
        
        long completed = userEnrollments.stream()
                .filter(e -> "COMPLETED".equals(e.getStatus()))
                .count();
        data.put("completedCourses", completed);
        
        double avgProgress = userEnrollments.stream()
                .mapToDouble(Enrollment::getProgress)
                .average()
                .orElse(0.0);
        data.put("averageProgress", Math.round(avgProgress * 100.0) / 100.0);
        
        return data;
    }
    
    public Map<String, Object> getCourseAnalytics(Long courseId) {
        Map<String, Object> data = new HashMap<>();
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        data.put("courseId", courseId);
        data.put("courseTitle", course.getTitle());
        
        List<Enrollment> courseEnrollments = enrollmentRepository.findByCourseId(courseId);
        data.put("totalEnrollments", courseEnrollments.size());
        
        long completed = courseEnrollments.stream()
                .filter(e -> "COMPLETED".equals(e.getStatus()))
                .count();
        data.put("completions", completed);
        
        double completionRate = courseEnrollments.isEmpty() ? 0 :
                (completed * 100.0) / courseEnrollments.size();
        data.put("completionRate", Math.round(completionRate * 100.0) / 100.0);
        
        double avgProgress = courseEnrollments.stream()
                .mapToDouble(Enrollment::getProgress)
                .average()
                .orElse(0.0);
        data.put("averageProgress", Math.round(avgProgress * 100.0) / 100.0);
        
        return data;
    }
}
