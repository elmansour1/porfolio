package com.faouzi.portfolio.service.api.dto.request;

import com.faouzi.portfolio.profile.domain.model.PublicationStatus;

public record ServiceFilterRequest(PublicationStatus status, Boolean featured, Integer page, Integer size) {
}
