package com.faouzi.portfolio.profile.infrastructure.persistence;

import com.faouzi.portfolio.profile.domain.model.PortfolioSectionSetting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioSectionSettingRepository extends JpaRepository<PortfolioSectionSetting, String> {

    List<PortfolioSectionSetting> findAllByOrderByDisplayOrderAsc();
}
