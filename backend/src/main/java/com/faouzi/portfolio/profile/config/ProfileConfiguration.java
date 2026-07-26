package com.faouzi.portfolio.profile.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(ProfileMediaProperties.class)
public class ProfileConfiguration {
}
