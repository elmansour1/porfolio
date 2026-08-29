package com.faouzi.portfolio.contact.application.service;

import com.faouzi.portfolio.contact.domain.model.ContactMessage;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends a best-effort e-mail notification for new contact messages.
 * <p>
 * No {@link JavaMailSender} bean is created by Spring Boot unless SMTP settings
 * (e.g. {@code SPRING_MAIL_HOST}) are configured, so this service gracefully
 * no-ops when mail is not configured or when sending fails, never blocking the
 * contact submission itself.
 */
@Service
@RequiredArgsConstructor
public class ContactNotificationService {

    private static final Logger log = LoggerFactory.getLogger(ContactNotificationService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    public void notifyNewMessage(ContactMessage message, String recipientEmail) {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            return;
        }
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            return;
        }
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(recipientEmail);
            mail.setSubject("Nouveau message de contact : " + message.getSubject());
            mail.setText(buildBody(message));
            mailSender.send(mail);
        } catch (MailException exception) {
            log.warn("Best-effort contact notification email could not be sent for message {}: {}",
                    message.getId(), exception.getMessage());
        }
    }

    private String buildBody(ContactMessage message) {
        return """
                Nouveau message reçu depuis le formulaire de contact du portfolio.

                Nom : %s
                E-mail : %s
                Entreprise : %s
                Type de demande : %s
                Sujet : %s

                Message :
                %s
                """.formatted(
                message.getName(),
                message.getEmail(),
                message.getCompany() == null ? "-" : message.getCompany(),
                message.getRequestType(),
                message.getSubject(),
                message.getMessage()
        );
    }
}
