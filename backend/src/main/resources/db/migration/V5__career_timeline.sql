create table career_experience (
    id uuid primary key,
    publication_status varchar(20) not null,
    experience_type varchar(30) not null,
    contract_type varchar(30),
    organization varchar(180),
    role_title varchar(180) not null,
    location varchar(180),
    work_mode varchar(20) not null,
    start_date date not null,
    end_date date,
    current_position boolean not null,
    confidential boolean not null,
    organization_url varchar(500),
    logo_media_id uuid,
    display_order integer not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_career_experience_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    constraint chk_career_experience_type check (experience_type in ('EMPLOYMENT', 'FREELANCE', 'INTERNSHIP', 'MISSION', 'VOLUNTEERING', 'OTHER')),
    constraint chk_career_contract_type check (contract_type is null or contract_type in ('PERMANENT', 'FIXED_TERM', 'FREELANCE', 'INTERNSHIP', 'APPRENTICESHIP', 'OTHER')),
    constraint chk_career_work_mode check (work_mode in ('ON_SITE', 'HYBRID', 'REMOTE')),
    constraint chk_career_experience_dates check (
        (current_position = true and end_date is null)
        or (current_position = false and end_date is not null and end_date >= start_date)
    ),
    constraint chk_career_experience_order check (display_order >= 0)
);

create table career_experience_translation (
    id uuid primary key,
    experience_id uuid not null references career_experience(id) on delete cascade,
    language_code varchar(2) not null,
    summary varchar(800),
    missions text,
    achievements text,
    confidential_label varchar(180),
    constraint uk_career_experience_translation_locale unique (experience_id, language_code),
    constraint chk_career_experience_translation_language check (language_code in ('fr', 'en'))
);

create table career_experience_skill (
    experience_id uuid not null references career_experience(id) on delete cascade,
    skill_id uuid not null references skill(id),
    display_order integer not null,
    primary key (experience_id, skill_id),
    constraint chk_career_experience_skill_order check (display_order >= 0)
);

create table career_education (
    id uuid primary key,
    publication_status varchar(20) not null,
    institution varchar(180) not null,
    education_level varchar(30),
    location varchar(180),
    start_date date not null,
    end_date date,
    current_education boolean not null,
    url varchar(500),
    logo_media_id uuid,
    display_order integer not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_career_education_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    constraint chk_career_education_level check (education_level is null or education_level in ('SECONDARY', 'BACHELOR', 'MASTER', 'ENGINEERING', 'DOCTORATE', 'PROFESSIONAL_TRAINING', 'CERTIFICATE', 'OTHER')),
    constraint chk_career_education_dates check (
        (current_education = true and end_date is null)
        or (current_education = false and end_date is not null and end_date >= start_date)
    ),
    constraint chk_career_education_order check (display_order >= 0)
);

create table career_education_translation (
    id uuid primary key,
    education_id uuid not null references career_education(id) on delete cascade,
    language_code varchar(2) not null,
    title varchar(220),
    field varchar(180),
    description text,
    constraint uk_career_education_translation_locale unique (education_id, language_code),
    constraint chk_career_education_translation_language check (language_code in ('fr', 'en'))
);

create table career_certification (
    id uuid primary key,
    publication_status varchar(20) not null,
    issuer varchar(180) not null,
    issue_date date not null,
    expiry_date date,
    no_expiry boolean not null,
    credential_id varchar(180),
    verification_url varchar(500),
    document_media_id uuid,
    display_order integer not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_career_certification_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    constraint chk_career_certification_dates check (
        (no_expiry = true and expiry_date is null)
        or (no_expiry = false and (expiry_date is null or expiry_date >= issue_date))
    ),
    constraint chk_career_certification_order check (display_order >= 0)
);

create table career_certification_translation (
    id uuid primary key,
    certification_id uuid not null references career_certification(id) on delete cascade,
    language_code varchar(2) not null,
    name varchar(220),
    description text,
    constraint uk_career_certification_translation_locale unique (certification_id, language_code),
    constraint chk_career_certification_translation_language check (language_code in ('fr', 'en'))
);

create index idx_career_experience_status_order on career_experience(publication_status, display_order, start_date);
create index idx_career_experience_dates on career_experience(start_date, end_date);
create index idx_career_education_status_order on career_education(publication_status, display_order, start_date);
create index idx_career_certification_status_order on career_certification(publication_status, display_order, issue_date);
