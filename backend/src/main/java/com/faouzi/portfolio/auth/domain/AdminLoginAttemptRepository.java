package com.faouzi.portfolio.auth.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminLoginAttemptRepository extends JpaRepository<AdminLoginAttempt, String> {
}
