alter table admin_user
    add column password_change_required boolean not null default false;

alter table admin_user
    add column last_login_at timestamp with time zone;

create table admin_login_attempt (
    email varchar(320) primary key,
    failure_count integer not null,
    locked_until timestamp with time zone,
    last_failure_at timestamp with time zone,
    updated_at timestamp with time zone not null
);

create table password_reset_token (
    id uuid primary key,
    admin_user_id uuid not null references admin_user(id),
    token_hash varchar(128) not null unique,
    expires_at timestamp with time zone not null,
    used_at timestamp with time zone,
    created_at timestamp with time zone not null
);

create index idx_password_reset_token_admin_user on password_reset_token(admin_user_id);
create index idx_password_reset_token_expires_at on password_reset_token(expires_at);

alter table activity_log
    add column ip_address varchar(64);

alter table activity_log
    add column user_agent varchar(255);
