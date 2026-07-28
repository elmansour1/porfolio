package com.faouzi.portfolio.profile.api.dto.response;

public record SectionSettingResponse(
        String sectionKey,
        String label,
        int displayOrder,
        boolean visible
) {
}
