create table contact_message (
    id uuid primary key,
    status varchar(20) not null,
    name varchar(160) not null,
    email varchar(320) not null,
    company varchar(160),
    request_type varchar(20) not null,
    subject varchar(200) not null,
    message text not null,
    consent boolean not null,
    ip_address varchar(64),
    user_agent varchar(300),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_contact_message_status check (status in ('NEW', 'READ', 'TO_REPLY', 'REPLIED', 'ARCHIVED', 'SPAM')),
    constraint chk_contact_message_request_type check (request_type in ('GENERAL', 'PROJECT', 'JOB', 'PARTNERSHIP', 'OTHER')),
    constraint chk_contact_message_consent check (consent = true)
);

create index idx_contact_message_status_created on contact_message(status, created_at);

create table contact_rate_limit (
    ip_address varchar(64) primary key,
    submission_count integer not null,
    window_started_at timestamp with time zone not null,
    last_submission_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);
