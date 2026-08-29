package com.faouzi.portfolio.contact.infrastructure.persistence;

import java.util.UUID;

import com.faouzi.portfolio.contact.domain.model.ContactMessage;
import com.faouzi.portfolio.contact.domain.model.ContactMessageStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {

    Page<ContactMessage> findByStatusOrderByCreatedAtDesc(ContactMessageStatus status, Pageable pageable);

    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
