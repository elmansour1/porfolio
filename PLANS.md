# PLANS

## Légende des états

`BACKLOG` | `READY` | `AUTHORIZED` | `IN_PROGRESS` | `BLOCKED` | `IN_REVIEW` | `DONE` | `CANCELLED`

---

## Phase 0 — Initialisation et audit

**Objectif :** Installer le framework d'entreprise virtuelle, détecter le mode, intégrer le brief produit, initialiser l'état.

**État :** `DONE`
**Autorisation :** `INITIALISATION_DU_FRAMEWORK` (2026-07-21)
**Date de clôture :** 2026-07-21

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 0.1 | Inspection du dépôt | Orchestrateur | DONE | CONFORME |
| 0.2 | Installation du framework | Orchestrateur, Documentation | DONE | CONFORME |
| 0.3 | Initialisation fichiers projet | Orchestrateur, Documentation | DONE | CONFORME |
| 0.4 | Création template exportable | Orchestrateur | DONE | CONFORME |
| 0.5 | Audit final d'initialisation | Orchestrateur, Reviewer Code | DONE | CONFORME |
| 0.6 | Audit complémentaire de portabilité du template | Orchestrateur, Documentation | DONE | CONFORME |
| 0.7 | Intégration du brief portfolio et réalignement projet | Orchestrateur, Product, Documentation | DONE | CONFORME |

---

## Phase 1 — Cadrage produit

**Objectif :** Valider et affiner le cadrage du portfolio professionnel avec MVP, acteurs, parcours et critères testables.

**État :** `DONE`
**Autorisation :** `GO pour la phase 1` (2026-07-21)
**Date de clôture :** 2026-07-21
**Dépendances :** `PROJECT_BRIEF.md` renseigné — satisfait le 2026-07-21

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 1.1 | Validation du problème, de la cible et de la proposition de valeur | Product, Métier | DONE | CONFORME |
| 1.2 | Validation du MVP et des exclusions | Product, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 1.3 | Parcours visiteurs et administrateur | Product, UX/UI | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 1.4 | Exigences fonctionnelles testables | Product, Métier, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 1.5 | Exigences non fonctionnelles et critères de succès | Product, Security, UX/UI, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 1.6 | Hypothèses, risques, contenus réels à préparer | Product, Documentation | DONE | CONFORME |
| 1.7 | Audit final de phase | Orchestrateur, Reviewer Code | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

**Livrables :** `docs/product/*`, `PROJECT.md` mis à jour

---

## Phase 2 — Architecture et conception

**Objectif :** Définir l'architecture, les modules, les contrats, la sécurité, l'UX/UI et les ADR.

**État :** `DONE`
**Autorisation :** `GO pour la phase 2` (2026-07-21)
**Date de clôture :** 2026-07-21
**Dépendances :** Phase 1 clôturée

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 2.1 | Architecture globale | Architecte | DONE | CONFORME |
| 2.2 | Modèle de données | Database, Architecte | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2.3 | Contrats API | Backend, Architecte | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2.4 | Architecture frontend | Frontend, Architecte | DONE | CONFORME |
| 2.5 | Conception UX/UI et design system | UX/UI | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2.6 | Sécurité et modèle de menaces | Security | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2.7 | Stratégie de test | QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2.8 | Infrastructure et déploiement | DevOps/SRE | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2.9 | ADR des décisions structurantes | Architecte | DONE | CONFORME |
| 2.10 | Audit final de phase | Orchestrateur | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

---

## Phase 3 — Conception UX/UI du portfolio

**Objectif :** Concevoir l'ensemble du site public et de l'espace administrateur avec un niveau SaaS premium, valider les écrans, parcours, états, responsive et accessibilité.

**État :** `DONE`
**Autorisation :** `GO pour la phase 3 — Conception UX/UI du portfolio` (2026-07-21)
**Date de clôture :** 2026-07-21
**Dépendances :** Phase 2 clôturée
**Exclusions :** Implémentation applicative, prototype exécutable, génération Angular, backend, base de données, déploiement

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 3.1 | Objectifs UX et architecture d'information | Product, UX/UI | DONE | CONFORME |
| 3.2 | Écrans et parcours du site public | Product, UX/UI, Accessibility, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 3.3 | Écrans et parcours de l'administration | Product, UX/UI, Frontend, Accessibility, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 3.4 | Design system, composants et tokens | UX/UI, Frontend | DONE | CONFORME |
| 3.5 | Responsive, accessibilité et états | UX/UI, Accessibility, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 3.6 | Handoff frontend et critères de validation | Frontend, QA | DONE | CONFORME |
| 3.7 | Audit UX/UI final | Reviewer UX/UI, Orchestrateur | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

**Rapport :** `.agents/state/PHASE_3_REPORT.md`

---

## Phase 4 — Fondations techniques

**Objectif :** Initialiser les fondations applicatives après `GO` humain : workspace frontend, backend, base, configuration locale, design tokens, sécurité minimale, tests de démarrage et documentation d'exécution.

**État :** `DONE`
**Autorisation :** `GO pour la phase 4 — Fondations techniques` (2026-07-21)
**Date de clôture :** 2026-07-21
**Dépendances :** Phase 3 clôturée
**Exclusions :** Fonctionnalités métier verticales complètes, données réelles publiées, déploiement production

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 4.1 | Enregistrement du GO et cadrage des fondations | Orchestrateur, Architecte, QA | DONE | CONFORME |
| 4.2 | Fondation backend Spring Boot | Backend, Security, Database, QA | DONE | CONFORME |
| 4.3 | Fondation frontend Angular | Frontend, UX/UI, Accessibility, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 4.4 | Fondation Docker, environnement et opérations locales | DevOps/SRE, Security, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 4.5 | Builds, tests et gates qualité frontend/backend | Frontend, Backend, Security, QA, Reviewer Code | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 4.6 | Audit final Phase 4 et arrêt | Orchestrateur, Reviewer Code | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

**Rapport :** `.agents/state/PHASE_4_REPORT.md`

## Phase 5 — Implémentation incrémentale

**État :** `READY`
**Autorisation :** `GO pour la sous-phase 5.3 — Profil professionnel et paramètres généraux du portfolio` (2026-07-22)
**Dépendances :** Phase 4 clôturée
**Périmètre autorisé :** Profil professionnel, paramètres généraux typés, traductions FR/EN du profil, liens professionnels, statistiques réelles administrables, configuration de visibilité des sections, photo/CV/logo/favicon contrôlés, API admin/public, affichage public limité aux données de profil/paramètres, tests, documentation et audits.
**Exclusions :** CRUD compétences/expériences/formations/projets/services/témoignages/messages, formulaire public de contact, médiathèque complète, SEO avancé, analytics, synchronisation GitHub/LinkedIn, plusieurs administrateurs, rôles complexes, blog, newsletter, thème personnalisable, sous-phase 5.4.
**Statut en cours :** Sous-phase 5.3 clôturée. Attente d'un `GO` humain explicite pour la sous-phase suivante.

### Sous-phase 5.1 — Authentification administrateur

**Objectif :** Livrer une authentification administrateur sécurisée et testée pour protéger l'espace d'administration.
**État :** `DONE`
**Autorisation :** `GO pour la sous-phase 5.1 — Authentification administrateur` (2026-07-21)
**Date de clôture :** 2026-07-21

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 5.1.1 | Cadrage sécurité et ADR auth reset | Product, Architecte, Security, QA | DONE | CONFORME |
| 5.1.2 | Backend authentification, sessions, bootstrap, reset | Backend, Database, Security, QA | DONE | CONFORME |
| 5.1.3 | Frontend auth admin et gestion session | Frontend, UX/UI, Security, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.1.4 | Documentation API, sécurité et Postman | Backend, Security, Documentation, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.1.5 | Builds, tests, gates et corrections | Frontend, Backend, Security, Reviewer Code, Reviewer UX/UI | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.1.6 | Audit final sous-phase 5.1 et arrêt | Orchestrateur, Reviewer Code, Reviewer UX/UI | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

**Rapport :** `.agents/state/PHASE_5_1_REPORT.md`

### Sous-phase 5.2 — Layout et dashboard de l'espace administrateur

**Objectif :** Livrer le socle complet, professionnel, responsive et réutilisable de l'espace d'administration, prêt à accueillir les futures fonctionnalités métier sans les implémenter.
**État :** `DONE`
**Autorisation :** `GO pour la sous-phase 5.2 — Layout et dashboard de l'espace administrateur` (2026-07-22)
**Date de clôture :** 2026-07-22

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 5.2.1 | Cadrage Product/UX/Security et choix navigation | Product, UX/UI, Security, QA | DONE | CONFORME |
| 5.2.2 | Architecture frontend admin shell et routing enfant | Architecte, Frontend, Security, QA | DONE | CONFORME |
| 5.2.3 | Implémentation layout, sidebar, toolbar et responsive | Frontend, UX/UI, Accessibility | DONE | CONFORME APRÈS CORRECTION |
| 5.2.4 | Implémentation dashboard, états et pages techniques | Product, Frontend, UX/UI, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.2.5 | Tests frontend, build, lint et corrections | Frontend, QA, Reviewer Code | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.2.6 | Inspection visuelle et audit UX/UI SaaS premium | UX/UI, Reviewer UX/UI, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.2.7 | Documentation, handoff, audit final et arrêt | Orchestrateur, Documentation, Reviewer Code, Reviewer UX/UI | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

**Rapports :** `.agents/state/PHASE_5_2_IMPLEMENTATION_REPORT.md`, `.agents/state/PHASE_5_2_UX_UI_AUDIT.md`, `.agents/state/PHASE_5_2_REPORT.md`

### Sous-phase 5.3 — Profil professionnel et paramètres généraux du portfolio

**Objectif :** Permettre à l'administrateur de gérer les informations principales du portfolio, les paramètres généraux et les médias principaux, puis d'afficher publiquement les données publiables sans modifier le code.
**État :** `DONE`
**Autorisation :** `GO pour la sous-phase 5.3 — Profil professionnel et paramètres généraux du portfolio` (2026-07-22)
**Date de clôture :** 2026-07-22

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 5.3.1 | Cadrage Product/Domain/UX/Security et contrats de profil | Product, Métier, Architecte, UX/UI, Security, QA | DONE | CONFORME |
| 5.3.2 | Modèle de données, migrations, médias et contraintes | Database, Backend, Security, QA | DONE | CONFORME |
| 5.3.3 | API backend admin/public, validations, journalisation et tests | Backend, Security, Database, QA | DONE | CONFORME |
| 5.3.4 | Pages admin Profil et Paramètres avec formulaires typés | Frontend, UX/UI, Accessibility, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.3.5 | Affichage public des données publiables du profil | Product, Frontend, UX/UI, Security, QA | DONE | CONFORME |
| 5.3.6 | Builds, tests, gates frontend/backend et corrections | Frontend, Backend, QA, Reviewer Code | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.3.7 | Inspection visuelle, accessibilité et audit UX/UI SaaS premium | UX/UI, Accessibility, Reviewer UX/UI, QA | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.3.8 | Documentation, handoff, audit final et arrêt | Orchestrateur, Documentation, Reviewer Code, Reviewer UX/UI | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

**Rapports :** `.agents/state/PHASE_5_3_IMPLEMENTATION_REPORT.md`, `.agents/state/PHASE_5_3_CODE_AUDIT.md`, `.agents/state/PHASE_5_3_UX_UI_AUDIT.md`, `.agents/state/PHASE_5_3_REPORT.md`

## Phase 6 — Stabilisation

**État :** `BACKLOG` — Dépend de Phase 5

## Phase 7 — Livraison

**État :** `BACKLOG` — Dépend de Phase 6

## Phase 8 — Exploitation et évolution

**État :** `BACKLOG` — Dépend de Phase 7

---

## Dernière mise à jour

2026-07-22
