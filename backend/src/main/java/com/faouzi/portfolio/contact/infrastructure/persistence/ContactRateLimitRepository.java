package com.faouzi.portfolio.contact.infrastructure.persistence;

import com.faouzi.portfolio.contact.domain.model.ContactRateLimit;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRateLimitRepository extends JpaRepository<ContactRateLimit, String> {
}
