# Modèle de données MVP

## Statut

Validé en Phase 2 — Architecture et conception. Migrations de fondation créées en Phases 4 et 5.1. Migration profil/paramètres créée en sous-phase 5.3. Migration compétences/catégories utilisée en sous-phase 5.4. Migration parcours professionnel créée en sous-phase 5.5. Migration projets et études de cas (`V6__projects.sql`) créée en sous-phase 5.6 : `project`, `project_translation`, `project_media`, `project_link`, `project_skill`.

## Principes

- PostgreSQL est la source persistante.
- Les contenus publics passent par un statut de publication.
- Les contenus traduisibles utilisent des tables de traduction par agrégat.
- Le français est la langue par défaut.
- L'anglais est requis pour le MVP public, mais la publication par langue suit ADR-0004.
- Les entités exposées par API passent par DTO, jamais directement.

## Types communs

| Type | Valeurs |
|------|---------|
| `publication_status` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `language_code` | `fr`, `en` |
| `message_status` | `NEW`, `READ`, `TO_REPLY`, `REPLIED`, `ARCHIVED`, `SPAM` |
| `media_kind` | `PROFILE_PHOTO`, `PROJECT_IMAGE`, `LOGO`, `CV_PDF`, `GENERAL_IMAGE` |
| `request_type` | `JOB_OPPORTUNITY`, `FREELANCE_MISSION`, `SERVICE_REQUEST`, `PARTNERSHIP`, `TECHNICAL_QUESTION`, `OTHER` |

## Entités principales

| Entité | Rôle | Relations clés |
|--------|------|----------------|
| `admin_user` | Compte administrateur unique | 1-n `activity_log` |
| `profile` | Identité professionnelle | n-1 photo média, n-1 CV média, 1-n traductions, 1-n liens sociaux |
| `site_section` | Activation et ordre des sections | 1-n traductions |
| `skill_category` | Groupe de compétences | 1-n traductions, 1-n compétences |
| `skill` | Compétence publiée ou brouillon | n-1 catégorie, 1-n traductions |
| `experience` | Expérience professionnelle | 1-n traductions, n-n technologies |
| `education` | Formation/certification | 1-n traductions, n-1 média document optionnel |
| `project` | Projet ou étude de cas | 1-n traductions, n-n technologies, 1-n médias |
| `technology` | Technologie réutilisable | n-n projets/expériences |
| `service_offer` | Service proposé | 1-n traductions |
| `testimonial` | Témoignage réel | 1-n traductions, média photo optionnel |
| `contact_message` | Message visiteur | aucun accès public |
| `media_asset` | Métadonnées de fichier | usages par profil/projet/etc. |
| `seo_metadata` | Métadonnées SEO par page/ressource/langue | lié à route ou ressource |
| `site_setting` | Paramètre global typé | clé unique |
| `activity_log` | Journal sensible | utilisateur admin optionnel |

## Modèle implémenté Phase 5.3

La migration `backend/src/main/resources/db/migration/V3__profile_and_site_settings.sql` ajoute :

- `profile_media` : métadonnées des médias principaux 5.3, avec kind, nom stocké sûr, type MIME, taille, alt text et date ;
- `professional_profile` : identité non traduisible, disponibilité, coordonnées et visibilités ;
- `professional_profile_translation` : contenus éditoriaux `fr/en` du profil ;
- `professional_link` : liens professionnels validés et ordonnés ;
- `professional_statistic` : statistiques réelles administrables, publiables et traduites ;
- `site_settings` : paramètres globaux typés ;
- `portfolio_section_setting` : visibilité et ordre des sections principales.

Les statistiques utilisent la colonne `stat_value` pour éviter les conflits avec les mots réservés SQL.

## Modèle implémenté Phase 5.4

La migration `backend/src/main/resources/db/migration/V4__skills.sql` ajoute :

- `skill_category` : statut de publication, icône, ordre et dates ;
- `skill_category_translation` : nom et description par langue `fr/en` ;
- `skill` : catégorie obligatoire, statut, niveau qualitatif, icône, mise en avant, visibilité, ordre et dates ;
- `skill_translation` : nom, description et résumé d'usage par langue `fr/en`.

Contraintes principales :

- `skill.category_id` référence une catégorie existante ;
- `publication_status` limité à `DRAFT`, `PUBLISHED`, `ARCHIVED` ;
- `level` limité à `NOTIONS`, `OPERATIONAL`, `ADVANCED`, `CORE_EXPERTISE` ou `null` ;
- `display_order >= 0` ;
- une traduction unique par `(resource_id, language_code)`.

## Migration de fondation Phase 4

La migration `backend/src/main/resources/db/migration/V1__foundation_schema.sql` crée uniquement les tables de base nécessaires aux fondations :

- `admin_user` ;
- `activity_log`.

Les autres tables métier du modèle MVP seront ajoutées progressivement par vertical slice autorisée.

## Migration auth Phase 5.1

La migration `backend/src/main/resources/db/migration/V2__admin_authentication.sql` ajoute :

- `admin_user.password_change_required` ;
- `admin_user.last_login_at` ;
- `admin_login_attempt` pour le verrouillage après échecs ;
- `password_reset_token` pour les jetons de reset hachés ;
- `activity_log.ip_address` et `activity_log.user_agent`.

## Contraintes d'intégrité

- Slug projet unique par langue publiée.
- Une compétence appartient toujours à une catégorie.
- Une traduction est unique par `(resource_id, language_code)`.
- Un projet publié doit avoir titre, résumé, slug et visuel de couverture ou fallback.
- Un message de contact possède toujours statut, nom, e-mail, sujet, type, message et consentement.
- Un média possède nom stocké sûr, type MIME, taille, hash ou identifiant technique, kind et statut d'usage.
- La suppression d'un média utilisé est bloquée ou demande confirmation selon le service admin.
- Un seul profil professionnel et une seule ligne de paramètres généraux sont maintenus par le service applicatif pour le MVP mono-propriétaire.
- Une traduction profil est unique par `(profile_id, language_code)`.
- Les sections sont uniques par `section_key`.
- Les liens et statistiques sont ordonnés par `display_order`.

## Index initiaux

- `project_translation(slug, language_code)` unique pour les projets publiables.
- `publication_status`, `display_order`, `featured` sur contenus publics.
- `contact_message(status, created_at)`.
- `activity_log(created_at, action)`.
- `media_asset(kind, created_at)`.
- Index FK sur toutes les relations.

## Points à détailler dans les prochaines sous-phases

- Type PostgreSQL enum vs check constraints.
- Stratégie de soft delete pour ressources admin.
- Contraintes de taille des champs.
- Migrations métier de contenu portfolio restantes : projets, services, messages et SEO.

## Dernière mise à jour

2026-08-02 (ajout du modèle projets et études de cas — sous-phase 5.6)

## Sous-phase 5.5 — Modèle parcours

Tables ajoutées par `V5__career_timeline.sql` :

- `career_experience`
- `career_experience_translation`
- `career_experience_skill`
- `career_education`
- `career_education_translation`
- `career_certification`
- `career_certification_translation`

Règles principales :

- Les dates sont stockées en précision jour (`date` / `LocalDate`) ; aucune date partielle n'est simulée.
- Les traductions sont séparées par langue avec unicité par ressource et `language_code`.
- Les expériences peuvent référencer les compétences existantes, sans dupliquer un référentiel technologies.
- Les contenus `DRAFT` ou `ARCHIVED` ne sont pas retournés par l'API publique.
- Une expérience confidentielle masque l'organisation et le lien public côté API publique.

## Sous-phase 5.6 — Modèle projets et études de cas

Tables ajoutées par `V6__projects.sql` :

- `project`
- `project_translation`
- `project_media`
- `project_link`
- `project_skill`

Règles principales :

- `confidentiality` (`PUBLIC`/`ANONYMIZED`/`PRIVATE`) est un attribut propre au projet, distinct du statut de publication partagé (`PublicationStatus`).
- `ANONYMIZED` masque `demo_url`/`github_url`/les liens dans les réponses publiques, mais conserve les médias.
- `PRIVATE` est totalement exclu des requêtes publiques (liste, détail, mis en avant, médias).
- Les technologies liées référencent le référentiel `skill` existant via `project_skill`, sans dupliquer de référentiel.
- Les médias sont typés (`COVER`/`GALLERY`) avec un ordre explicite pour la galerie.
- Le slug est unique et revalidé à chaque écriture (création et modification).
