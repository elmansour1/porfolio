package com.faouzi.portfolio.auth.infrastructure.persistence;

import com.faouzi.portfolio.auth.domain.model.AdminLoginAttempt;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminLoginAttemptRepository extends JpaRepository<AdminLoginAttempt, String> {
}
