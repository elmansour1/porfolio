package com.faouzi.portfolio.service.domain.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@IdClass(ServiceSkillId.class)
@Table(name = "service_skill")
public class ServiceSkill {

    @Id
    @Column(name = "service_id", nullable = false)
    private UUID serviceId;

    @Id
    @Column(name = "skill_id", nullable = false)
    private UUID skillId;

    @Id
    @Enumerated(EnumType.STRING)
    @Column(name = "relation_type", nullable = false, length = 20)
    private ServiceSkillRelationType relationType;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    public ServiceSkill(UUID serviceId, UUID skillId, ServiceSkillRelationType relationType, int displayOrder) {
        this.serviceId = serviceId;
        this.skillId = skillId;
        this.relationType = relationType;
        this.displayOrder = displayOrder;
    }
}
