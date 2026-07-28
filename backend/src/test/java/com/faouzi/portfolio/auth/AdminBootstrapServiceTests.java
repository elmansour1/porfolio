package com.faouzi.portfolio.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.faouzi.portfolio.auth.infrastructure.persistence.AdminUserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "app.auth.bootstrap.email=bootstrap@example.test",
        "app.auth.bootstrap.password=BootstrapPassword-123"
})
class AdminBootstrapServiceTests {

    @Autowired
    private AdminUserRepository users;

    @Test
    void createsInitialAdministratorFromEnvironmentWhenDatabaseIsEmpty() {
        assertThat(users.findByEmail("bootstrap@example.test")).isPresent();
    }
}
