package com.faouzi.portfolio.service.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.service.domain.model.ServiceDeliverable;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceDeliverableRepository extends JpaRepository<ServiceDeliverable, UUID> {

    List<ServiceDeliverable> findByServiceIdOrderByDisplayOrderAsc(UUID serviceId);

    void deleteByServiceId(UUID serviceId);
}
