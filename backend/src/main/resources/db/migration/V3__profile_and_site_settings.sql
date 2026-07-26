create table profile_media (
    id uuid primary key,
    kind varchar(40) not null,
    original_filename varchar(255) not null,
    stored_filename varchar(255) not null unique,
    content_type varchar(120) not null,
    size_bytes bigint not null,
    alt_text varchar(255),
    created_at timestamp with time zone not null,
    constraint chk_profile_media_kind check (kind in ('PROFILE_PHOTO', 'CV_PDF', 'SITE_LOGO', 'SITE_FAVICON')),
    constraint chk_profile_media_size check (size_bytes > 0)
);

create table professional_profile (
    id uuid primary key,
    publication_status varchar(20) not null,
    first_name varchar(120) not null,
    last_name varchar(120) not null,
    display_name varchar(180) not null,
    location varchar(180),
    country varchar(120),
    availability_status varchar(40) not null,
    professional_email varchar(320),
    phone varchar(60),
    photo_media_id uuid references profile_media(id),
    cv_media_id uuid references profile_media(id),
    show_email boolean not null,
    show_phone boolean not null,
    show_photo boolean not null,
    show_cv boolean not null,
    show_links boolean not null,
    show_statistics boolean not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_professional_profile_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    constraint chk_professional_profile_availability check (availability_status in ('AVAILABLE', 'OPEN_TO_OPPORTUNITIES', 'UNAVAILABLE', 'HIDDEN'))
);

create table professional_profile_translation (
    id uuid primary key,
    profile_id uuid not null references professional_profile(id) on delete cascade,
    language_code varchar(2) not null,
    professional_title varchar(180),
    tagline varchar(240),
    short_summary varchar(600),
    biography text,
    about_text text,
    availability_label varchar(160),
    primary_cta_label varchar(120),
    primary_cta_url varchar(500),
    secondary_cta_label varchar(120),
    secondary_cta_url varchar(500),
    footer_text varchar(500),
    constraint uk_profile_translation_locale unique (profile_id, language_code),
    constraint chk_profile_translation_language check (language_code in ('fr', 'en'))
);

create table professional_link (
    id uuid primary key,
    profile_id uuid not null references professional_profile(id) on delete cascade,
    type varchar(40) not null,
    label varchar(120) not null,
    url varchar(500) not null,
    icon varchar(80),
    display_order integer not null,
    visible boolean not null,
    open_in_new_tab boolean not null,
    constraint chk_professional_link_order check (display_order >= 0),
    constraint chk_professional_link_type check (type in ('GITHUB', 'LINKEDIN', 'PERSONAL_SITE', 'EMAIL', 'OTHER'))
);

create table professional_statistic (
    id uuid primary key,
    profile_id uuid not null references professional_profile(id) on delete cascade,
    stat_value varchar(80) not null,
    label_fr varchar(120) not null,
    label_en varchar(120) not null,
    display_order integer not null,
    visible boolean not null,
    constraint chk_professional_statistic_order check (display_order >= 0)
);

create table site_settings (
    id uuid primary key,
    public_site_name varchar(180) not null,
    monogram varchar(12) not null,
    default_language varchar(2) not null,
    active_languages varchar(20) not null,
    contact_recipient_email varchar(320),
    footer_copyright varchar(240),
    show_cv_download boolean not null,
    show_contact_details boolean not null,
    show_social_links boolean not null,
    maintenance_mode boolean not null,
    logo_media_id uuid references profile_media(id),
    favicon_media_id uuid references profile_media(id),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_site_settings_default_language check (default_language in ('fr', 'en'))
);

create table portfolio_section_setting (
    section_key varchar(40) primary key,
    label varchar(120) not null,
    display_order integer not null,
    visible boolean not null,
    updated_at timestamp with time zone not null,
    constraint chk_portfolio_section_order check (display_order >= 0),
    constraint chk_portfolio_section_key check (section_key in (
        'HERO',
        'ABOUT',
        'SKILLS',
        'EXPERIENCES',
        'EDUCATION',
        'PROJECTS',
        'SERVICES',
        'METHOD',
        'TESTIMONIALS',
        'CONTACT'
    ))
);

create index idx_professional_link_profile_order on professional_link(profile_id, display_order);
create index idx_professional_statistic_profile_order on professional_statistic(profile_id, display_order);
create index idx_profile_media_kind on profile_media(kind);
