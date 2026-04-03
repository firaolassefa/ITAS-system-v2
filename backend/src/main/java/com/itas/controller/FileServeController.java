package com.itas.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Paths;

@RestController
public class FileServeController {

    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    @GetMapping("/uploads/**")
    public ResponseEntity<Resource> serveFile(
            @RequestHeader(value = "Range", required = false) String range,
            jakarta.servlet.http.HttpServletRequest request) {

        String path = request.getRequestURI().replaceFirst(".*/uploads/", "");
        File file = Paths.get(uploadDir).resolve(path).toFile();

        if (!file.exists() || !file.isFile()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String contentType = detectContentType(file.getName());

        return ResponseEntity.ok()
                .header("X-Frame-Options", "ALLOWALL")
                .header("Access-Control-Allow-Origin", "*")
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    private String detectContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".pdf"))  return "application/pdf";
        if (lower.endsWith(".mp4"))  return "video/mp4";
        if (lower.endsWith(".webm")) return "video/webm";
        if (lower.endsWith(".ogg"))  return "video/ogg";
        if (lower.endsWith(".png"))  return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (lower.endsWith(".pptx")) return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        return "application/octet-stream";
    }
}
