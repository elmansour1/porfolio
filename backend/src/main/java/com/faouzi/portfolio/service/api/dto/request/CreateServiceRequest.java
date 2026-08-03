package com.faouzi.portfolio.service.api.dto.request;

import java.util.List;
import java.util.UUID;

import com.faouzi.portfolio.service.domain.model.ServiceCtaType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateServiceRequest(
        @Size(max = 160) String slug,
        boolean featured,
        @Min(0) int displayOrder,
        @Size(max = 80) String icon,
        @Size(max = 500) String visualUrl,
        ServiceCtaType ctaType,
        @Size(max = 500) String ctaTarget,
        @NotNull @Valid List<ServiceTranslationRequest> translations,
        @NotNull @Valid List<BenefitRequest> benefits,
        @NotNull @Valid List<DeliverableRequest> deliverables,
        @NotNull List<UUID> technologyIds,
        @NotNull List<UUID> skillIds
) {
}
