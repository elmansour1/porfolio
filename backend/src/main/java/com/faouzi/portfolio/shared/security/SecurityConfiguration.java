package com.faouzi.portfolio.shared.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.HttpStatusAccessDeniedHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
public class SecurityConfiguration {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler csrfRequestHandler = new CsrfTokenRequestAttributeHandler();
        csrfRequestHandler.setCsrfRequestAttributeName(null);
        CookieCsrfTokenRepository csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        csrfTokenRepository.setCookiePath("/");
        csrfTokenRepository.setHeaderName("X-XSRF-TOKEN");

        return http
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfTokenRepository)
                        .csrfTokenRequestHandler(csrfRequestHandler)
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        .accessDeniedHandler(new HttpStatusAccessDeniedHandler(HttpStatus.FORBIDDEN))
                )
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/status").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/portfolio").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/skills").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/career").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/projects/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/services/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/profile/photo").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/profile/cv").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/settings/logo").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/public/settings/favicon").permitAll()
                        .requestMatchers(HttpMethod.GET, "/actuator/health", "/actuator/health/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/admin/auth/csrf").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/admin/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/admin/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/admin/auth/reset-password").permitAll()
                        .requestMatchers("/api/v1/admin/**").authenticated()
                        .anyRequest().denyAll()
                )
                .formLogin(formLogin -> formLogin.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
