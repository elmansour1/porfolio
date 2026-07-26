create table admin_user (
    id uuid primary key,
    email varchar(320) not null unique,
    password_hash varchar(255) not null,
    enabled boolean not null default true,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create table activity_log (
    id uuid primary key,
    admin_user_id uuid references admin_user(id),
    action varchar(120) not null,
    resource_type varchar(120),
    resource_id varchar(120),
    result varchar(40) not null,
    created_at timestamp with time zone not null
);

create index idx_activity_log_created_at on activity_log(created_at);
create index idx_activity_log_action on activity_log(action);
