package com.itas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

import java.util.List;

@Service
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@itas.gov.et}")
    private String fromEmail;
    
    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;
    
    /**
     * Send a simple text email
     */
    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        if (!emailEnabled) {
            return;
        }
        
        if (mailSender == null) {
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("? Failed to send email to " + to + ": " + e.getMessage());
            // Don't throw exception - we don't want email failures to break the notification system
        }
    }
    
    /**
     * Send HTML email
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        if (!emailEnabled) {
            return;
        }
        
        if (mailSender == null) {
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("? Failed to send HTML email to " + to + ": " + e.getMessage());
        }
    }
    
    /**
     * Send bulk emails (one by one to avoid spam filters)
     */
    @Async
    public void sendBulkEmail(List<String> recipients, String subject, String body) {
        if (recipients == null || recipients.isEmpty()) {
            return;
        }
        
        int successCount = 0;
        int failCount = 0;
        
        for (String recipient : recipients) {
            if (recipient == null || recipient.trim().isEmpty()) {
                continue;
            }
            
            try {
                sendSimpleEmail(recipient, subject, body);
                successCount++;
                
                // Small delay to avoid overwhelming the mail server
                Thread.sleep(100);
            } catch (Exception e) {
                failCount++;
                System.err.println("? Failed to send to " + recipient + ": " + e.getMessage());
            }
        }
    }
    
    /**
     * Send notification email with ITAS branding
     */
    @Async
    public void sendNotificationEmail(String to, String title, String message, String link) {
        String subject = "ITAS Notification: " + title;
        
        String htmlBody = buildNotificationEmailTemplate(title, message, link);
        
        sendHtmlEmail(to, subject, htmlBody);
    }
    
    /**
     * Build HTML email template for notifications
     */
    private String buildNotificationEmailTemplate(String title, String message, String link) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
                    .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #6b7280; }
                    .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                    .button:hover { background: #d97706; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>??? ITAS</h1>
                        <p>Integrated Tax Administration System</p>
                    </div>
                    <div class="content">
                        <h2>%s</h2>
                        <p>%s</p>
                        %s
                    </div>
                    <div class="footer">
                        <p>ï¿½ 2024 Ministry of Revenue - Ethiopia</p>
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                title,
                message.replace("\n", "<br>"),
                link != null && !link.isEmpty() 
                    ? "<a href='http://localhost:5173" + link + "' class='button'>View in ITAS</a>"
                    : ""
            );
    }
    
    /**
     * Test email configuration
     */
    public boolean testEmailConfiguration() {
        try {
            if (!emailEnabled) {
                return false;
            }
            
            if (mailSender == null) {
                return false;
            }
            
            // Try to send a test email
            sendSimpleEmail(fromEmail, "ITAS Email Test", "This is a test email from ITAS system.");
            return true;
        } catch (Exception e) {
            System.err.println("? Email configuration test failed: " + e.getMessage());
            return false;
        }
    }
}

