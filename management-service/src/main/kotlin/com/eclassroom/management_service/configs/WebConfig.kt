package com.eclassroom.management_service.configs

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
class WebConfig : WebMvcConfigurer {
    private val logger = LoggerFactory.getLogger(WebConfig::class.java)

    override fun addCorsMappings(registry: CorsRegistry) {
        logger.info("Configuring CORS for /graphql")
        // This will allow CORS requests for the GraphQL endpoint
        registry.addMapping("/graphql")
            .allowedOrigins("http://localhost:5173") // The frontend's origin
            .allowedMethods("GET", "POST", "OPTIONS") // Allow OPTIONS for preflight
            .allowedHeaders("*") // Allow any headers (or specify specific headers)
            .allowCredentials(true) // Allow credentials if required
    }
}
