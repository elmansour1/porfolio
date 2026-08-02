package com.faouzi.portfolio.project.api.dto.response;

import java.util.List;

public record ProjectMetadataResponse(
        List<OptionResponse> publicationStatuses,
        List<OptionResponse> projectTypes,
        List<OptionResponse> realStatuses,
        List<OptionResponse> confidentialityLevels
) {

    public record OptionResponse(String label, String value) {
    }
}
