# Journal des décisions

## Format

Chaque décision structurante est également inscrite dans un ADR (`docs/adr/`).

## Décisions

| Date | ID | Sujet | Décision | ADR | Agent |
|------|----|-------|----------|-----|-------|
| 2026-07-21 | D-001 | Mode de travail initial | Mode A — Nouvelle idée avant réception du brief détaillé | N/A | Orchestrateur |
| 2026-07-21 | D-002 | Périmètre initialisation | Framework uniquement, pas de code métier | N/A | Orchestrateur |
| 2026-07-21 | D-003 | Stack de référence | Angular 20+ / Java 21 / Spring Boot 4+ / PostgreSQL (référence, non encore décidée par ADR) | À créer lors du cadrage | Orchestrateur |
| 2026-07-21 | D-004 | Portabilité du template | Les fichiers projet du template doivent être des modèles neutres, sans état ni date du dépôt courant | N/A | Orchestrateur |
| 2026-07-21 | D-005 | Mode de travail après brief | Mode B — Nouveau projet défini pour le portfolio professionnel `faouzi-portfolio` | N/A | Orchestrateur |
| 2026-07-21 | D-006 | Périmètre MVP initial | Site public premium administrable, admin sécurisé, français/anglais, contact, SEO/accessibilité/performance de base | N/A | Orchestrateur |
| 2026-07-21 | D-007 | Interdictions MVP | Pas de microservices, Kubernetes, multi-tenant, blog complet, paiement, rôles complexes, IA ou synchronisations complètes sans GO ultérieur | N/A | Orchestrateur |
| 2026-07-21 | D-008 | Clôture Phase 1 | Cadrage produit clôturé avec réserves acceptées et tracées ; Phase 2 non lancée | N/A | Orchestrateur |
| 2026-07-21 | D-009 | Priorisation MVP | Fonctions classées MUST/SHOULD/COULD/LATER pour limiter le scope | N/A | Product |
| 2026-07-21 | D-010 | Architecture MVP | Monolithe modulaire Spring Boot + Angular + PostgreSQL + Docker Compose | ADR-0001 | Architecte |
| 2026-07-21 | D-011 | Rendu public | Angular SSR pour routes publiques dynamiques, admin CSR | ADR-0002 | Architecte |
| 2026-07-21 | D-012 | Auth admin | Session serveur Spring Security avec cookie sécurisé et CSRF | ADR-0003 | Security |
| 2026-07-21 | D-013 | Publication/i18n | Statuts simples et traduction publiable par langue | ADR-0004 | Architecte |
| 2026-07-21 | D-014 | Médias | Filesystem persistant MVP avec metadata DB et whitelist stricte | ADR-0005 | Security |
| 2026-07-21 | D-015 | API | REST versionné `/api/v1`, séparation public/admin | ADR-0008 | Backend |
| 2026-07-21 | D-016 | Clôture Phase 2 | Architecture et conception clôturées avec réserves acceptées et tracées ; Phase 3 non lancée | N/A | Orchestrateur |
| 2026-07-21 | D-017 | Réalignement Phase 3 | Phase 3 exécutée comme conception UX/UI complète du portfolio, sans prototype ni implémentation applicative | N/A | Orchestrateur |
| 2026-07-21 | D-018 | Conception UX/UI | Écrans publics/admin, parcours, wireframes textuels, design system, responsive, accessibilité et handoff frontend validés en conception | ADR-0010 | UX/UI |
| 2026-07-21 | D-019 | Clôture Phase 3 | Conception UX/UI clôturée avec réserves acceptées et tracées ; Phase 4 non lancée | N/A | Orchestrateur |
| 2026-07-21 | D-020 | Lancement Phase 4 | Fondations techniques autorisées : backend, frontend, Docker/env, tests de démarrage, gates qualité, sans fonctionnalité métier Phase 5 | N/A | Orchestrateur |
| 2026-07-21 | D-021 | Versions fondations | Backend Spring Boot 4.0.1, frontend Angular 20.3, Node 20 requis, Docker Compose local | ADR-0001 | Orchestrateur |
| 2026-07-21 | D-022 | Clôture Phase 4 | Fondations techniques clôturées avec réserves acceptées et tracées ; Phase 5 non lancée | N/A | Orchestrateur |
| 2026-07-21 | D-023 | Lancement sous-phase 5.1 | Authentification administrateur autorisée avec bootstrap admin, session, reset mot de passe, limitation tentatives, journaux, UI auth, tests et docs ; gestion de contenu exclue | ADR-0003 | Orchestrateur |
| 2026-07-21 | D-024 | Reset mot de passe admin | Jeton aléatoire hashé, usage unique, expiration, non exposé par défaut ; exposition locale/test uniquement jusqu'au choix du canal de remise production | ADR-0011 | Security |
| 2026-07-21 | D-025 | Clôture sous-phase 5.1 | Authentification administrateur clôturée avec réserves acceptées et tracées ; sous-phase 5.2 non lancée | ADR-0003, ADR-0011 | Orchestrateur |
| 2026-07-22 | D-026 | Lancement sous-phase 5.2 | Layout et dashboard admin autorisés : shell, sidebar, toolbar, routing enfant, dashboard avec états vides, pages techniques, responsive, tests et UX premium ; CRUD métier et sous-phase 5.3 exclus | ADR-0010 | Orchestrateur |
| 2026-07-22 | D-027 | Clôture sous-phase 5.2 | Layout et dashboard admin clôturés avec réserves acceptées et tracées ; sous-phase 5.3 non lancée | ADR-0010 | Orchestrateur |
| 2026-07-22 | D-028 | Lancement sous-phase 5.3 | Profil professionnel et paramètres généraux autorisés : modèle, migrations, API, médias principaux, admin profil/paramètres, affichage public limité, tests, audits et documentation ; sous-phase 5.4 exclue | ADR-0004, ADR-0005, ADR-0008, ADR-0009, ADR-0010 | Orchestrateur |
| 2026-07-22 | D-029 | Clôture sous-phase 5.3 | Profil professionnel, paramètres généraux typés, médias principaux, API admin/public et affichage public limité clôturés avec réserves acceptées et tracées ; sous-phase 5.4 non lancée | ADR-0004, ADR-0005, ADR-0008, ADR-0009, ADR-0010 | Orchestrateur |
| 2026-07-26 | D-030 | Lancement sous-phase 5.4 | Gestion compétences et catégories autorisée : modèle, migrations, API, admin avec sélections PrimeNG, section publique, tests, audits et documentation ; sous-phase 5.5 exclue | ADR-0004, ADR-0008, ADR-0009, ADR-0010 | Orchestrateur |
| 2026-07-26 | D-031 | Clôture sous-phase 5.4 | Compétences et catégories clôturées : modèle relationnel dédié, API admin/public, interface admin avec PrimeNG pour les sélections, section publique, tests et audits ; inspection visuelle runtime non exécutée et tracée ; sous-phase 5.5 non lancée | ADR-0004, ADR-0008, ADR-0009, ADR-0010 | Orchestrateur |
| 2026-07-26 | D-032 | Correctif qualité backend/frontend post-5.4 | Repositories déplacés de `domain` vers `infrastructure.persistence`, entités JPA converties à Lombok sans `@Data`, selects HTML natifs restants remplacés par `p-select` PrimeNG | ADR-0001, ADR-0010 | Orchestrateur |
| 2026-07-26 | D-033 | Structuration DTO et features | DTO REST backend déplacés dans `api.dto`; pas de DTO JPA artificiel pour les entités; features frontend `profile` et `skills` structurées en `api`, `models/dto`, `pages` | ADR-0001, ADR-0008, ADR-0010 | Orchestrateur |
| 2026-07-26 | D-034 | DTO frontend | Les contrats DTO consommés par les services API frontend sont placés dans `models/dto`; les payloads ne restent pas déclarés dans les services | ADR-0010 | Orchestrateur |
| 2026-07-26 | D-035 | Modèles backend et DTO applicatifs | Les modèles de domaine backend sont placés dans `domain.model`; les DTO/résultats internes utilisés par les services applicatifs sont placés dans `application.dto` | ADR-0001, ADR-0008 | Orchestrateur |
| 2026-07-26 | D-036 | Restructuration architecturale senior | Intervention exceptionnelle clôturée : DTO backend séparés `api.dto.request`/`api.dto.response`, services dans `application.service`, mappers dans `application.mapper`, stockage média dans `infrastructure.storage`, injection Lombok, DTO/forms/mappers frontend, shared UI admin et suppression des sélecteurs natifs du périmètre | ADR-0012 | Orchestrateur |
| 2026-07-26 | D-037 | Lancement sous-phase 5.5 | Gestion expériences, formations et certifications autorisée : modèle relationnel dédié, API admin/public, confidentialité, technologies liées, admin PrimeNG, section publique, tests et audits ; sous-phase 5.6 exclue | ADR-0004, ADR-0008, ADR-0009, ADR-0010, ADR-0012 | Orchestrateur |
| 2026-07-26 | D-038 | Dates du parcours | Les dates du parcours sont stockées en précision jour (`LocalDate`/date ISO) ; les dates partielles mois/année ne sont pas simulées par un premier jour de mois sans décision ultérieure | ADR-0009 | Product, Domain Expert, Database |
| 2026-07-26 | D-039 | Clôture sous-phase 5.5 | Expériences, formations et certifications clôturées avec réserves tracées : écrans admin authentifiés non inspectés visuellement faute de mot de passe du volume Docker existant ; sous-phase 5.6 non lancée | ADR-0004, ADR-0008, ADR-0009, ADR-0010, ADR-0012 | Orchestrateur |
| 2026-08-29 | D-040 | Lancement Phase 6 | Stabilisation autorisée : régressions, sécurité contact, isolation data-access public, docs, inspection visuelle ; livraison production exclue | N/A | Orchestrateur |
| 2026-08-29 | D-041 | Clôture Phase 6 | Stabilisation clôturée avec réserves : contenu réel et admin non inspectés, budget bundle et Playwright reportés ; Phase 7 non lancée | N/A | Orchestrateur |

## Dernière mise à jour

2026-08-29
