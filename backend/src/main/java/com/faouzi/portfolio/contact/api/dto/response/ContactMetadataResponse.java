package com.faouzi.portfolio.contact.api.dto.response;

import java.util.List;

public record ContactMetadataResponse(
        List<OptionResponse> statuses,
        List<OptionResponse> requestTypes
) {
}
