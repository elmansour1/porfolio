create table project (
    id uuid primary key,
    slug varchar(160) not null,
    project_type varchar(30) not null,
    real_status varchar(20) not null,
    publication_status varchar(20) not null,
    confidentiality varchar(20) not null,
    start_date date,
    end_date date,
    ongoing boolean not null,
    featured boolean not null,
    display_order integer not null,
    demo_url varchar(500),
    github_url varchar(500),
    indexable boolean not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint uk_project_slug unique (slug),
    constraint chk_project_type check (project_type in (
        'SAAS_APPLICATION', 'BUSINESS_PLATFORM', 'BACKEND_API', 'DASHBOARD',
        'EDUCATIONAL_PLATFORM', 'DOCUMENTATION_SYSTEM', 'DEVOPS_PROJECT',
        'PROTOTYPE', 'TECHNICAL_AUDIT', 'DESIGN_STUDY', 'OTHER'
    )),
    constraint chk_project_real_status check (real_status in (
        'IN_PROGRESS', 'COMPLETED', 'MAINTAINED', 'PROTOTYPE', 'SUSPENDED'
    )),
    constraint chk_project_publication_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    constraint chk_project_confidentiality check (confidentiality in ('PUBLIC', 'ANONYMIZED', 'PRIVATE')),
    constraint chk_project_dates check (
        (ongoing = true and end_date is null)
        or (ongoing = false and (end_date is null or start_date is null or end_date >= start_date))
    ),
    constraint chk_project_order check (display_order >= 0)
);

create table project_translation (
    id uuid primary key,
    project_id uuid not null references project(id) on delete cascade,
    language_code varchar(2) not null,
    title varchar(220),
    summary varchar(800),
    description text,
    context text,
    problem text,
    objectives text,
    target_users text,
    role text,
    responsibilities text,
    solution text,
    architecture_notes text,
    features text,
    challenges text,
    decisions text,
    results text,
    seo_title varchar(70),
    seo_description varchar(160),
    constraint uk_project_translation_locale unique (project_id, language_code),
    constraint chk_project_translation_language check (language_code in ('fr', 'en'))
);

create table project_skill (
    project_id uuid not null references project(id) on delete cascade,
    skill_id uuid not null references skill(id),
    display_order integer not null,
    primary key (project_id, skill_id),
    constraint chk_project_skill_order check (display_order >= 0)
);

create table project_link (
    id uuid primary key,
    project_id uuid not null references project(id) on delete cascade,
    label varchar(120) not null,
    url varchar(500) not null,
    display_order integer not null,
    constraint chk_project_link_order check (display_order >= 0)
);

create table project_media (
    id uuid primary key,
    project_id uuid not null references project(id) on delete cascade,
    kind varchar(20) not null,
    stored_filename varchar(255) not null unique,
    original_filename varchar(255) not null,
    content_type varchar(120) not null,
    size_bytes bigint not null,
    alt_text varchar(255),
    caption varchar(255),
    display_order integer not null,
    created_at timestamp with time zone not null,
    constraint chk_project_media_kind check (kind in ('COVER', 'GALLERY')),
    constraint chk_project_media_order check (display_order >= 0)
);

create index idx_project_status_order on project(publication_status, display_order);
create index idx_project_featured on project(featured, display_order);
create index idx_project_confidentiality on project(confidentiality);
create index idx_project_media_project on project_media(project_id, kind, display_order);
