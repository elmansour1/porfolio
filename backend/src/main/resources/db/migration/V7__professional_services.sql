create table professional_service (
    id uuid primary key,
    slug varchar(160),
    publication_status varchar(20) not null,
    featured boolean not null,
    display_order integer not null,
    icon varchar(80),
    visual_url varchar(500),
    cta_type varchar(30),
    cta_target varchar(500),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint uk_professional_service_slug unique (slug),
    constraint chk_professional_service_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    constraint chk_professional_service_order check (display_order >= 0),
    constraint chk_professional_service_cta check (cta_type is null or cta_type in ('CONTACT', 'PROJECTS', 'EMAIL', 'RESUME', 'EXTERNAL_URL'))
);

create table professional_service_translation (
    id uuid primary key,
    service_id uuid not null references professional_service(id) on delete cascade,
    language_code varchar(2) not null,
    title varchar(180) not null,
    summary varchar(500),
    description text,
    problem text,
    target_audience text,
    cta_label varchar(120),
    constraint uk_professional_service_translation_locale unique (service_id, language_code),
    constraint chk_professional_service_translation_language check (language_code in ('fr', 'en'))
);

create table service_benefit (
    id uuid primary key,
    service_id uuid not null references professional_service(id) on delete cascade,
    active boolean not null,
    display_order integer not null,
    constraint chk_service_benefit_order check (display_order >= 0)
);

create table service_benefit_translation (
    id uuid primary key,
    benefit_id uuid not null references service_benefit(id) on delete cascade,
    language_code varchar(2) not null,
    label varchar(180) not null,
    description varchar(500),
    constraint uk_service_benefit_translation_locale unique (benefit_id, language_code),
    constraint chk_service_benefit_translation_language check (language_code in ('fr', 'en'))
);

create table service_deliverable (
    id uuid primary key,
    service_id uuid not null references professional_service(id) on delete cascade,
    active boolean not null,
    display_order integer not null,
    constraint chk_service_deliverable_order check (display_order >= 0)
);

create table service_deliverable_translation (
    id uuid primary key,
    deliverable_id uuid not null references service_deliverable(id) on delete cascade,
    language_code varchar(2) not null,
    label varchar(180) not null,
    description varchar(500),
    constraint uk_service_deliverable_translation_locale unique (deliverable_id, language_code),
    constraint chk_service_deliverable_translation_language check (language_code in ('fr', 'en'))
);

create table service_skill (
    service_id uuid not null references professional_service(id) on delete cascade,
    skill_id uuid not null references skill(id),
    relation_type varchar(20) not null,
    display_order integer not null,
    primary key (service_id, skill_id, relation_type),
    constraint chk_service_skill_relation_type check (relation_type in ('SKILL', 'TECHNOLOGY')),
    constraint chk_service_skill_order check (display_order >= 0)
);

create table work_process_step (
    id uuid primary key,
    publication_status varchar(20) not null,
    display_order integer not null,
    icon varchar(80),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint chk_work_process_step_status check (publication_status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    constraint chk_work_process_step_order check (display_order >= 0)
);

create table work_process_step_translation (
    id uuid primary key,
    step_id uuid not null references work_process_step(id) on delete cascade,
    language_code varchar(2) not null,
    title varchar(180) not null,
    description text,
    expected_result varchar(500),
    constraint uk_work_process_step_translation_locale unique (step_id, language_code),
    constraint chk_work_process_step_translation_language check (language_code in ('fr', 'en'))
);

create index idx_professional_service_status_order on professional_service(publication_status, display_order);
create index idx_professional_service_featured_order on professional_service(featured, display_order);
create index idx_service_benefit_service_order on service_benefit(service_id, display_order);
create index idx_service_deliverable_service_order on service_deliverable(service_id, display_order);
create index idx_service_skill_service_order on service_skill(service_id, relation_type, display_order);
create index idx_work_process_step_status_order on work_process_step(publication_status, display_order);

insert into professional_service (
    id, slug, publication_status, featured, display_order, icon, cta_type, cta_target, created_at, updated_at
) values
    ('91000000-0000-0000-0000-000000000001', 'developpement-backend-java-spring-boot', 'PUBLISHED', true, 10, 'pi pi-server', 'CONTACT', null, current_timestamp, current_timestamp),
    ('91000000-0000-0000-0000-000000000002', 'developpement-frontend-angular', 'PUBLISHED', true, 20, 'pi pi-desktop', 'PROJECTS', null, current_timestamp, current_timestamp),
    ('91000000-0000-0000-0000-000000000003', 'conception-api-rest', 'PUBLISHED', false, 30, 'pi pi-share-alt', 'CONTACT', null, current_timestamp, current_timestamp),
    ('91000000-0000-0000-0000-000000000004', 'audit-technique-maintenance', 'PUBLISHED', false, 40, 'pi pi-search', 'CONTACT', null, current_timestamp, current_timestamp);

insert into professional_service_translation (
    id, service_id, language_code, title, summary, description, problem, target_audience, cta_label
) values
    ('91000000-0000-0000-0001-000000000001', '91000000-0000-0000-0000-000000000001', 'fr', 'Développement backend Java et Spring Boot', 'Concevoir des APIs et services backend maintenables pour des applications web métier.', 'Mise en place de services Spring Boot structurés, sécurisés et testables, avec persistance PostgreSQL lorsque le produit en a besoin.', 'Réduire la fragilité d''une logique serveur dispersée ou difficile à maintenir.', 'Startups, PME, équipes techniques et porteurs de projets numériques.', 'Discuter du besoin'),
    ('91000000-0000-0000-0001-000000000002', '91000000-0000-0000-0000-000000000001', 'en', 'Java and Spring Boot backend development', 'Design maintainable backend APIs and services for business web applications.', 'Implementation of structured, secure and testable Spring Boot services, with PostgreSQL persistence when the product needs it.', 'Reduce the fragility of scattered or hard-to-maintain server-side logic.', 'Startups, small businesses, technical teams and digital project owners.', 'Discuss the need'),
    ('91000000-0000-0000-0001-000000000003', '91000000-0000-0000-0000-000000000002', 'fr', 'Développement frontend Angular', 'Créer des interfaces Angular claires, responsive et administrables.', 'Construction de composants Angular typés, intégrés à PrimeNG et Tailwind, avec une attention portée aux formulaires, états et parcours.', 'Transformer des écrans complexes en interfaces lisibles et exploitables.', 'Équipes produit, responsables techniques, PME et organisations avec application web.', 'Voir les projets'),
    ('91000000-0000-0000-0001-000000000004', '91000000-0000-0000-0000-000000000002', 'en', 'Angular frontend development', 'Build clear, responsive and maintainable Angular interfaces.', 'Typed Angular components integrated with PrimeNG and Tailwind, with attention to forms, states and user flows.', 'Turn complex screens into readable and usable interfaces.', 'Product teams, technical leads, small businesses and organizations with web applications.', 'View projects'),
    ('91000000-0000-0000-0001-000000000005', '91000000-0000-0000-0000-000000000003', 'fr', 'Conception d''API REST', 'Définir des contrats REST cohérents entre backend, frontend et usages métier.', 'Cadrage des ressources, DTO, validations, erreurs, pagination et documentation utile pour faciliter l''intégration.', 'Éviter les APIs ambiguës, difficiles à tester ou trop couplées à la base de données.', 'Équipes techniques, projets SaaS et applications métiers.', 'Cadrer une API'),
    ('91000000-0000-0000-0001-000000000006', '91000000-0000-0000-0000-000000000003', 'en', 'REST API design', 'Define consistent REST contracts between backend, frontend and business needs.', 'Resource modelling, DTOs, validation, errors, pagination and useful documentation to support integration.', 'Avoid ambiguous APIs that are difficult to test or tightly coupled to the database.', 'Technical teams, SaaS projects and business applications.', 'Scope an API'),
    ('91000000-0000-0000-0001-000000000007', '91000000-0000-0000-0000-000000000004', 'fr', 'Audit technique et maintenance applicative', 'Identifier les risques techniques et stabiliser progressivement une application existante.', 'Analyse ciblée du code, des dépendances, des tests et des parcours critiques, puis priorisation de corrections pragmatiques.', 'Retrouver de la lisibilité et réduire les risques avant d''ajouter de nouvelles évolutions.', 'PME, équipes produit et responsables techniques avec application existante.', 'Planifier un audit'),
    ('91000000-0000-0000-0001-000000000008', '91000000-0000-0000-0000-000000000004', 'en', 'Technical audit and application maintenance', 'Identify technical risks and progressively stabilize an existing application.', 'Focused review of code, dependencies, tests and critical flows, followed by pragmatic remediation priorities.', 'Recover clarity and reduce risks before adding new changes.', 'Small businesses, product teams and technical leads with an existing application.', 'Plan an audit');

insert into service_benefit (id, service_id, active, display_order) values
    ('92000000-0000-0000-0000-000000000001', '91000000-0000-0000-0000-000000000001', true, 10),
    ('92000000-0000-0000-0000-000000000002', '91000000-0000-0000-0000-000000000001', true, 20),
    ('92000000-0000-0000-0000-000000000003', '91000000-0000-0000-0000-000000000002', true, 10),
    ('92000000-0000-0000-0000-000000000004', '91000000-0000-0000-0000-000000000003', true, 10),
    ('92000000-0000-0000-0000-000000000005', '91000000-0000-0000-0000-000000000004', true, 10);

insert into service_benefit_translation (id, benefit_id, language_code, label, description) values
    ('92000000-0000-0000-0001-000000000001', '92000000-0000-0000-0000-000000000001', 'fr', 'Architecture backend claire', null),
    ('92000000-0000-0000-0001-000000000002', '92000000-0000-0000-0000-000000000001', 'en', 'Clear backend architecture', null),
    ('92000000-0000-0000-0001-000000000003', '92000000-0000-0000-0000-000000000002', 'fr', 'API documentée et testable', null),
    ('92000000-0000-0000-0001-000000000004', '92000000-0000-0000-0000-000000000002', 'en', 'Documented and testable API', null),
    ('92000000-0000-0000-0001-000000000005', '92000000-0000-0000-0000-000000000003', 'fr', 'Interface responsive et cohérente', null),
    ('92000000-0000-0000-0001-000000000006', '92000000-0000-0000-0000-000000000003', 'en', 'Responsive and consistent interface', null),
    ('92000000-0000-0000-0001-000000000007', '92000000-0000-0000-0000-000000000004', 'fr', 'Contrats lisibles pour les intégrations', null),
    ('92000000-0000-0000-0001-000000000008', '92000000-0000-0000-0000-000000000004', 'en', 'Readable integration contracts', null),
    ('92000000-0000-0000-0001-000000000009', '92000000-0000-0000-0000-000000000005', 'fr', 'Priorisation des risques techniques', null),
    ('92000000-0000-0000-0001-000000000010', '92000000-0000-0000-0000-000000000005', 'en', 'Prioritized technical risks', null);

insert into service_deliverable (id, service_id, active, display_order) values
    ('93000000-0000-0000-0000-000000000001', '91000000-0000-0000-0000-000000000001', true, 10),
    ('93000000-0000-0000-0000-000000000002', '91000000-0000-0000-0000-000000000002', true, 10),
    ('93000000-0000-0000-0000-000000000003', '91000000-0000-0000-0000-000000000003', true, 10),
    ('93000000-0000-0000-0000-000000000004', '91000000-0000-0000-0000-000000000004', true, 10);

insert into service_deliverable_translation (id, deliverable_id, language_code, label, description) values
    ('93000000-0000-0000-0001-000000000001', '93000000-0000-0000-0000-000000000001', 'fr', 'Code source et tests', null),
    ('93000000-0000-0000-0001-000000000002', '93000000-0000-0000-0000-000000000001', 'en', 'Source code and tests', null),
    ('93000000-0000-0000-0001-000000000003', '93000000-0000-0000-0000-000000000002', 'fr', 'Interface Angular intégrée', null),
    ('93000000-0000-0000-0001-000000000004', '93000000-0000-0000-0000-000000000002', 'en', 'Integrated Angular interface', null),
    ('93000000-0000-0000-0001-000000000005', '93000000-0000-0000-0000-000000000003', 'fr', 'Contrats API et documentation', null),
    ('93000000-0000-0000-0001-000000000006', '93000000-0000-0000-0000-000000000003', 'en', 'API contracts and documentation', null),
    ('93000000-0000-0000-0001-000000000007', '93000000-0000-0000-0000-000000000004', 'fr', 'Rapport d''audit exploitable', null),
    ('93000000-0000-0000-0001-000000000008', '93000000-0000-0000-0000-000000000004', 'en', 'Actionable audit report', null);

insert into work_process_step (id, publication_status, display_order, icon, created_at, updated_at) values
    ('94000000-0000-0000-0000-000000000001', 'PUBLISHED', 10, 'pi pi-comments', current_timestamp, current_timestamp),
    ('94000000-0000-0000-0000-000000000002', 'PUBLISHED', 20, 'pi pi-compass', current_timestamp, current_timestamp),
    ('94000000-0000-0000-0000-000000000003', 'PUBLISHED', 30, 'pi pi-sitemap', current_timestamp, current_timestamp),
    ('94000000-0000-0000-0000-000000000004', 'PUBLISHED', 40, 'pi pi-code', current_timestamp, current_timestamp),
    ('94000000-0000-0000-0000-000000000005', 'PUBLISHED', 50, 'pi pi-check-circle', current_timestamp, current_timestamp),
    ('94000000-0000-0000-0000-000000000006', 'PUBLISHED', 60, 'pi pi-send', current_timestamp, current_timestamp),
    ('94000000-0000-0000-0000-000000000007', 'PUBLISHED', 70, 'pi pi-life-ring', current_timestamp, current_timestamp);

insert into work_process_step_translation (id, step_id, language_code, title, description, expected_result) values
    ('94000000-0000-0000-0001-000000000001', '94000000-0000-0000-0000-000000000001', 'fr', 'Compréhension du besoin', 'Clarification du contexte, des utilisateurs et des contraintes réelles du projet.', 'Vision partagée du problème à résoudre'),
    ('94000000-0000-0000-0001-000000000002', '94000000-0000-0000-0000-000000000001', 'en', 'Understanding the need', 'Clarify the context, users and real constraints of the project.', 'Shared view of the problem to solve'),
    ('94000000-0000-0000-0001-000000000003', '94000000-0000-0000-0000-000000000002', 'fr', 'Cadrage', 'Découpage du périmètre, des priorités, des risques et des critères d''acceptation.', 'Périmètre exploitable et priorisé'),
    ('94000000-0000-0000-0001-000000000004', '94000000-0000-0000-0000-000000000002', 'en', 'Scoping', 'Define scope, priorities, risks and acceptance criteria.', 'Usable and prioritized scope'),
    ('94000000-0000-0000-0001-000000000005', '94000000-0000-0000-0000-000000000003', 'fr', 'Conception', 'Préparation de l''architecture, des parcours et des contrats techniques utiles.', 'Solution compréhensible avant développement'),
    ('94000000-0000-0000-0001-000000000006', '94000000-0000-0000-0000-000000000003', 'en', 'Design', 'Prepare architecture, user flows and useful technical contracts.', 'Understandable solution before development'),
    ('94000000-0000-0000-0001-000000000007', '94000000-0000-0000-0000-000000000004', 'fr', 'Développement', 'Implémentation progressive, testable et alignée avec les priorités validées.', 'Incréments fonctionnels vérifiables'),
    ('94000000-0000-0000-0001-000000000008', '94000000-0000-0000-0000-000000000004', 'en', 'Development', 'Progressive and testable implementation aligned with agreed priorities.', 'Verifiable functional increments'),
    ('94000000-0000-0000-0001-000000000009', '94000000-0000-0000-0000-000000000005', 'fr', 'Tests et validation', 'Vérification des comportements, corrections et revue des parcours importants.', 'Version prête à être livrée'),
    ('94000000-0000-0000-0001-000000000010', '94000000-0000-0000-0000-000000000005', 'en', 'Testing and validation', 'Check behaviours, fix issues and review important flows.', 'Version ready to deliver'),
    ('94000000-0000-0000-0001-000000000011', '94000000-0000-0000-0000-000000000006', 'fr', 'Livraison', 'Préparation de l''exécution locale ou du déploiement selon le contexte.', 'Livrables transmis avec consignes utiles'),
    ('94000000-0000-0000-0001-000000000012', '94000000-0000-0000-0000-000000000006', 'en', 'Delivery', 'Prepare local execution or deployment depending on the context.', 'Deliverables shared with useful guidance'),
    ('94000000-0000-0000-0001-000000000013', '94000000-0000-0000-0000-000000000007', 'fr', 'Accompagnement', 'Suivi des questions, ajustements raisonnables et transmission de la documentation.', 'Continuité après livraison'),
    ('94000000-0000-0000-0001-000000000014', '94000000-0000-0000-0000-000000000007', 'en', 'Support', 'Follow up on questions, reasonable adjustments and documentation handoff.', 'Continuity after delivery');
