package com.itas.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SmsService {
    
    @Value("${app.sms.enabled:false}")
    private boolean smsEnabled;
    
    @Value("${twilio.account.sid:}")
    private String twilioAccountSid;
    
    @Value("${twilio.auth.token:}")
    private String twilioAuthToken;
    
    @Value("${twilio.phone.number:}")
    private String twilioPhoneNumber;
    
    /**
     * Send SMS message
     * Currently a mock implementation - ready for Twilio integration
     */
    @Async
    public void sendSms(String phoneNumber, String message) {
        if (!smsEnabled) {
            System.out.println("📱 SMS DISABLED - Would send to: " + phoneNumber);
            System.out.println("   Message: " + message);
            return;
        }
        
        // TODO: Implement actual SMS sending with Twilio
        // For now, just log it
        try {
            if (twilioAccountSid.isEmpty() || twilioAuthToken.isEmpty()) {
                System.out.println("⚠️ Twilio credentials not configured");
                System.out.println("📱 MOCK SMS to: " + phoneNumber);
                System.out.println("   Message: " + message);
                return;
            }
            
            // Twilio implementation would go here:
            /*
            Twilio.init(twilioAccountSid, twilioAuthToken);
            Message twilioMessage = Message.creator(
                new PhoneNumber(phoneNumber),
                new PhoneNumber(twilioPhoneNumber),
                message
            ).create();
            System.out.println("✅ SMS sent successfully. SID: " + twilioMessage.getSid());
            */
            
            System.out.println("📱 SMS sent to: " + phoneNumber);
        } catch (Exception e) {
            System.err.println("❌ Failed to send SMS to " + phoneNumber + ": " + e.getMessage());
        }
    }
    
    /**
     * Send bulk SMS messages
     */
    @Async
    public void sendBulkSms(List<String> phoneNumbers, String message) {
        if (phoneNumbers == null || phoneNumbers.isEmpty()) {
            System.out.println("⚠️ No phone numbers provided for bulk SMS");
            return;
        }
        
        System.out.println("📱 Sending bulk SMS to " + phoneNumbers.size() + " recipients...");
        
        int successCount = 0;
        int failCount = 0;
        
        for (String phoneNumber : phoneNumbers) {
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                continue;
            }
            
            try {
                sendSms(phoneNumber, message);
                successCount++;
                
                // Small delay to avoid rate limiting
                Thread.sleep(200);
            } catch (Exception e) {
                failCount++;
                System.err.println("❌ Failed to send SMS to " + phoneNumber + ": " + e.getMessage());
            }
        }
        
        System.out.println("✅ Bulk SMS complete: " + successCount + " sent, " + failCount + " failed");
    }
    
    /**
     * Format phone number to international format
     */
    private String formatPhoneNumber(String phoneNumber) {
        // Remove all non-digit characters
        String cleaned = phoneNumber.replaceAll("[^0-9]", "");
        
        // Add country code if not present (assuming Ethiopia +251)
        if (!cleaned.startsWith("251")) {
            if (cleaned.startsWith("0")) {
                cleaned = "251" + cleaned.substring(1);
            } else {
                cleaned = "251" + cleaned;
            }
        }
        
        return "+" + cleaned;
    }
    
    /**
     * Test SMS configuration
     */
    public boolean testSmsConfiguration() {
        if (!smsEnabled) {
            System.out.println("⚠️ SMS is disabled in configuration");
            return false;
        }
        
        if (twilioAccountSid.isEmpty() || twilioAuthToken.isEmpty()) {
            System.out.println("⚠️ Twilio credentials not configured");
            return false;
        }
        
        System.out.println("✅ SMS configuration looks good (Twilio integration pending)");
        return true;
    }
}
