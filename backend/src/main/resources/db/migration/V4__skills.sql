create table skill_category (
    id uuid primary key,
    publication_status varchar(20) not null,
    icon varchar(80),
    display_order integer not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_skill_category_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    constraint chk_skill_category_order check (display_order >= 0)
);

create table skill_category_translation (
    id uuid primary key,
    category_id uuid not null references skill_category(id) on delete cascade,
    language_code varchar(2) not null,
    name varchar(160),
    description varchar(600),
    constraint uk_skill_category_translation_locale unique (category_id, language_code),
    constraint chk_skill_category_translation_language check (language_code in ('fr', 'en'))
);

create table skill (
    id uuid primary key,
    category_id uuid not null references skill_category(id),
    publication_status varchar(20) not null,
    level varchar(20),
    icon varchar(80),
    featured boolean not null,
    visible boolean not null,
    display_order integer not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_skill_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    constraint chk_skill_level check (level is null or level in ('NOTIONS', 'OPERATIONAL', 'ADVANCED', 'CORE_EXPERTISE')),
    constraint chk_skill_order check (display_order >= 0)
);

create table skill_translation (
    id uuid primary key,
    skill_id uuid not null references skill(id) on delete cascade,
    language_code varchar(2) not null,
    name varchar(160),
    description varchar(600),
    usage_summary varchar(600),
    constraint uk_skill_translation_locale unique (skill_id, language_code),
    constraint chk_skill_translation_language check (language_code in ('fr', 'en'))
);

create index idx_skill_category_status_order on skill_category(publication_status, display_order);
create index idx_skill_category_id_order on skill(category_id, display_order);
create index idx_skill_status_order on skill(publication_status, display_order);
create index idx_skill_featured on skill(featured);
