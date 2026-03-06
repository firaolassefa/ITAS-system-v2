package com.itas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI itasOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ITAS Tax Education System API")
                        .description("Comprehensive API documentation for the Inland Tax Administration System (ITAS) - A modern tax education and training platform")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("ITAS Development Team")
                                .email("support@itas.gov")
                                .url("https://itas.gov"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://itas.gov/license")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:9090/api")
                                .description("Local Development Server"),
                        new Server()
                                .url("https://api.itas.gov")
                                .description("Production Server")))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT token obtained from /auth/login endpoint")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
}
