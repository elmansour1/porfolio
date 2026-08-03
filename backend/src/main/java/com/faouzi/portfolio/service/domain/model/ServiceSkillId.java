package com.faouzi.portfolio.service.domain.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ServiceSkillId implements Serializable {

    private UUID serviceId;
    private UUID skillId;
    private ServiceSkillRelationType relationType;

    public ServiceSkillId(UUID serviceId, UUID skillId, ServiceSkillRelationType relationType) {
        this.serviceId = serviceId;
        this.skillId = skillId;
        this.relationType = relationType;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof ServiceSkillId that)) {
            return false;
        }
        return Objects.equals(serviceId, that.serviceId)
                && Objects.equals(skillId, that.skillId)
                && relationType == that.relationType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(serviceId, skillId, relationType);
    }
}
