package com.faouzi.portfolio.service.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.service.domain.model.ServiceBenefit;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceBenefitRepository extends JpaRepository<ServiceBenefit, UUID> {

    List<ServiceBenefit> findByServiceIdOrderByDisplayOrderAsc(UUID serviceId);

    void deleteByServiceId(UUID serviceId);
}
