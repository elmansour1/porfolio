package com.faouzi.portfolio.auth.application.service;

import com.faouzi.portfolio.auth.domain.model.AdminUser;
import com.faouzi.portfolio.auth.infrastructure.persistence.AdminUserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository users;

    @Override
    public UserDetails loadUserByUsername(String username) {
        AdminUser admin = users.findByEmail(AdminUser.normalizeEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("Administrator not found."));
        return User.withUsername(admin.getEmail())
                .password(admin.getPasswordHash())
                .authorities("ROLE_ADMIN")
                .disabled(!admin.isEnabled())
                .build();
    }
}
