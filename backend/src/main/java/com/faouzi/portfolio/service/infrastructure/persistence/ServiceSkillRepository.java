package com.faouzi.portfolio.service.infrastructure.persistence;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.service.domain.model.ServiceSkill;
import com.faouzi.portfolio.service.domain.model.ServiceSkillId;
import com.faouzi.portfolio.service.domain.model.ServiceSkillRelationType;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceSkillRepository extends JpaRepository<ServiceSkill, ServiceSkillId> {

    List<ServiceSkill> findByServiceIdOrderByDisplayOrderAsc(UUID serviceId);

    List<ServiceSkill> findByServiceIdAndRelationTypeOrderByDisplayOrderAsc(UUID serviceId, ServiceSkillRelationType relationType);

    void deleteByServiceId(UUID serviceId);
}
