package com.faouzi.portfolio.career.api.dto.response;

import java.util.List;

public record CareerMetadataResponse(
        List<OptionResponse> publicationStatuses,
        List<OptionResponse> experienceTypes,
        List<OptionResponse> contractTypes,
        List<OptionResponse> workModes,
        List<OptionResponse> educationLevels
) {
    public record OptionResponse(String label, String value) {
    }
}
