package com.faouzi.portfolio.project.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(ProjectMediaProperties.class)
public class ProjectConfiguration {
}
