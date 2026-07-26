package com.faouzi.portfolio.auth.application;

import java.util.ArrayList;
import java.util.List;

import com.faouzi.portfolio.shared.error.ApiException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class PasswordPolicy {

    private static final int MIN_LENGTH = 12;

    public void validate(String password) {
        List<String> violations = new ArrayList<>();
        if (password == null || password.length() < MIN_LENGTH) {
            violations.add("password: must contain at least 12 characters");
        }
        if (password != null && password.chars().noneMatch(Character::isUpperCase)) {
            violations.add("password: must contain an uppercase letter");
        }
        if (password != null && password.chars().noneMatch(Character::isLowerCase)) {
            violations.add("password: must contain a lowercase letter");
        }
        if (password != null && password.chars().noneMatch(Character::isDigit)) {
            violations.add("password: must contain a digit");
        }
        if (password != null && password.chars().allMatch(Character::isLetterOrDigit)) {
            violations.add("password: must contain a symbol");
        }

        if (!violations.isEmpty()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "WEAK_PASSWORD",
                    "The password does not meet the security policy.",
                    violations
            );
        }
    }
}
