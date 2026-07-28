package com.faouzi.portfolio.skills.api.dto.response;

import java.util.List;

public record SkillMetadataResponse(
        List<OptionResponse> publicationStatuses,
        List<OptionResponse> levels
) {
    public record OptionResponse(String label, String value) {
    }
}
