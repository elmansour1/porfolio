package com.faouzi.portfolio.career.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.career.domain.model.CareerExperienceSkill;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerExperienceSkillRepository extends JpaRepository<CareerExperienceSkill, CareerExperienceSkill.Key> {

    List<CareerExperienceSkill> findByExperienceIdOrderByDisplayOrderAsc(UUID experienceId);

    void deleteByExperienceId(UUID experienceId);
}
