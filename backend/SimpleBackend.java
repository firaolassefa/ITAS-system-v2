import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.*;
import com.sun.net.httpserver.*;

public class SimpleBackend {
    
    private static final SimpleDateFormat ISO_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    
    public static void main(String[] args) throws IOException {
        System.out.println("?? Starting ITAS Simple Backend Server...");
        System.out.println("?? Port: 8080");
        
        ISO_FORMAT.setTimeZone(TimeZone.getTimeZone("UTC"));
        
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // Health endpoint
        server.createContext("/api/health", (exchange -> {
            String response = "{\"status\": \"UP\", \"service\": \"ITAS Backend\", \"timestamp\": \"" + new Date() + "\"}";
            sendResponse(exchange, 200, response);
        }));
        
        // Test endpoint
        server.createContext("/api/test", (exchange -> {
            String response = "{\"message\": \"Backend is working!\", \"endpoints\": [\"/api/health\", \"/api/auth/login\", \"/api/courses\"]}";
            sendResponse(exchange, 200, response);
        }));
        
        // Login endpoint (matches your frontend auth.ts)
        server.createContext("/api/auth/login", (exchange -> {
            if ("POST".equals(exchange.getRequestMethod())) {
                String requestBody = readRequestBody(exchange.getRequestBody());
                System.out.println("Login request: " + requestBody);
                
                // Mock login response (same as your frontend expects)
                String response = "{\"data\": {\"user\": {\"id\": 1, \"username\": \"taxpayer\", \"fullName\": \"John Taxpayer\", \"email\": \"taxpayer@example.com\", \"userType\": \"TAXPAYER\", \"taxNumber\": \"TXN-123456\", \"companyName\": \"Doe Enterprises\", \"active\": true, \"createdAt\": \"" + ISO_FORMAT.format(new Date()) + "\"}, \"token\": \"mock-token-" + System.currentTimeMillis() + "\"}, \"message\": \"Login successful\"}";
                sendResponse(exchange, 200, response);
            } else {
                sendResponse(exchange, 405, "{\"error\": \"Method not allowed\"}");
            }
        }));
        
        // Courses endpoint (matches your frontend courses.ts)
        server.createContext("/api/courses", (exchange -> {
            if ("GET".equals(exchange.getRequestMethod())) {
                String courses = "[{\"id\": 1, \"title\": \"VAT Fundamentals for Beginners\", \"description\": \"Learn basic VAT concepts\", \"category\": \"VAT\", \"difficulty\": \"BEGINNER\", \"durationHours\": 4, \"modules\": [\"Intro\", \"Registration\"], \"published\": true}, {\"id\": 2, \"title\": \"Income Tax Calculation\", \"description\": \"Complete guide to income tax\", \"category\": \"INCOME_TAX\", \"difficulty\": \"INTERMEDIATE\", \"durationHours\": 6, \"modules\": [\"Tax Brackets\", \"Deductions\"], \"published\": true}]";
                String response = "{\"data\": " + courses + "}";
                sendResponse(exchange, 200, response);
            } else {
                sendResponse(exchange, 405, "{\"error\": \"Method not allowed\"}");
            }
        }));
        
        // Default CORS headers
        server.createContext("/", (exchange -> {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
            exchange.sendResponseHeaders(200, -1);
        }));
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("? Server started successfully!");
        System.out.println("?? Open browser to: http://localhost:8080/api/health");
        System.out.println("?? Test login with: POST http://localhost:8080/api/auth/login");
        System.out.println("?? Courses: GET http://localhost:8080/api/courses");
        System.out.println("\nPress Ctrl+C to stop the server");
    }
    
    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(statusCode, response.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
    
    private static String readRequestBody(InputStream is) {
        Scanner scanner = new Scanner(is).useDelimiter("\\A");
        return scanner.hasNext() ? scanner.next() : "";
    }
}
