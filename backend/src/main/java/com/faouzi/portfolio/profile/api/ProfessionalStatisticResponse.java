package com.faouzi.portfolio.profile.api;

import java.util.UUID;

public record ProfessionalStatisticResponse(
        UUID id,
        String value,
        String labelFr,
        String labelEn,
        int displayOrder,
        boolean visible
) {
}
