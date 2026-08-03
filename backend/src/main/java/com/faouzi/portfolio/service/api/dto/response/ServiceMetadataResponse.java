package com.faouzi.portfolio.service.api.dto.response;

import java.util.List;

public record ServiceMetadataResponse(
        List<OptionResponse> publicationStatuses,
        List<OptionResponse> ctaTypes,
        List<ServiceReferenceResponse> skillOptions
) {
}
