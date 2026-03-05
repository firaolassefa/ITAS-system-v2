package com.itas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type")
                .allowCredentials(true)
                .maxAge(3600);
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Use absolute path to ensure files are found
        String uploadsPath = System.getProperty("user.dir") + "/uploads/";
        String certificatesPath = System.getProperty("user.dir") + "/certificates/";
        
        System.out.println("Serving uploads from: " + uploadsPath);
        System.out.println("Serving certificates from: " + certificatesPath);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsPath);
        
        registry.addResourceHandler("/certificates/**")
                .addResourceLocations("file:" + certificatesPath);
    }
}