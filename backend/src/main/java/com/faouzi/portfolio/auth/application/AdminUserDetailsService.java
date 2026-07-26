package com.faouzi.portfolio.auth.application;

import com.faouzi.portfolio.auth.domain.AdminUser;
import com.faouzi.portfolio.auth.domain.AdminUserRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository users;

    public AdminUserDetailsService(AdminUserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        AdminUser admin = users.findByEmail(AdminUser.normalizeEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("Administrator not found."));
        return User.withUsername(admin.email())
                .password(admin.passwordHash())
                .authorities("ROLE_ADMIN")
                .disabled(!admin.enabled())
                .build();
    }
}
