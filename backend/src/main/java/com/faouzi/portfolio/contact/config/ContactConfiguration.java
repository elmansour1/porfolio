package com.faouzi.portfolio.contact.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(ContactProperties.class)
public class ContactConfiguration {
}
