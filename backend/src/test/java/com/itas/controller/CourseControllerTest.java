package com.itas.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CourseControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void testGetAllCourses() throws Exception {
        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].title").exists());
    }
    
    @Test
    public void testGetCourseById() throws Exception {
        mockMvc.perform(get("/api/courses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1));
    }
    
    @Test
    public void testGetNonExistentCourse() throws Exception {
        mockMvc.perform(get("/api/courses/999"))
                .andExpect(status().isNotFound());
    }
}