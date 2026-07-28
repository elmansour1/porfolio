package com.faouzi.portfolio.audit.infrastructure.persistence;

import com.faouzi.portfolio.audit.domain.model.ActivityLog;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
}
