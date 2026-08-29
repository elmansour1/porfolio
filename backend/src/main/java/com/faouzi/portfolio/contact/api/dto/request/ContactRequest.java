package com.faouzi.portfolio.contact.api.dto.request;

import com.faouzi.portfolio.contact.domain.model.ContactRequestType;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank @Size(max = 160) String name,
        @NotBlank @Email @Size(max = 320) String email,
        @Size(max = 160) String company,
        @NotNull ContactRequestType requestType,
        @NotBlank @Size(max = 200) String subject,
        @NotBlank @Size(max = 5000) String message,
        boolean consent,
        String website
) {

    @AssertTrue(message = "Consent is required before sending a contact message.")
    public boolean isConsentGiven() {
        return consent;
    }
}
