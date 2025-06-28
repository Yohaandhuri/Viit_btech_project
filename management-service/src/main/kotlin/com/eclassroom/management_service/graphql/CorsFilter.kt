package com.eclassroom.management_service.graphql
import jakarta.servlet.FilterChain
import jakarta.servlet.FilterConfig
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.stereotype.Component
import java.io.IOException

@Component
class CorsFilter : OncePerRequestFilter() {
    private val logger = LoggerFactory.getLogger(CorsFilter::class.java)

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
        logger.info("Inside CorsFilter: ${request.method} ${request.requestURI}")

        response.addHeader("Access-Control-Allow-Origin", "http://localhost:5173")
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.addHeader("Access-Control-Allow-Credentials", "true")

        if ("OPTIONS" == request.method) {
            response.status = HttpServletResponse.SC_OK
            return
        }

        filterChain.doFilter(request, response)
    }
}
