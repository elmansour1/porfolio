package com.faouzi.portfolio.profile.api;

public record SectionSettingResponse(
        String sectionKey,
        String label,
        int displayOrder,
        boolean visible
) {
}
