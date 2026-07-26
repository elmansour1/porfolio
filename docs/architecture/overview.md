# Architecture — Vue d'ensemble

## Statut

Validé en Phase 2 — Architecture et conception.

## Décision synthétique

Le MVP utilise une architecture monolithe modulaire côté backend, une application Angular unique séparant routes publiques et routes d'administration, PostgreSQL comme base relationnelle, et Docker Compose pour l'environnement local et le déploiement simple.

Les routes publiques dynamiques à enjeu SEO utilisent Angular SSR. Les pages statiques comme mentions légales peuvent être prérendues si cela reste simple. L'administration reste une expérience client-side protégée.

## Objectifs architecturaux

- Livrer un portfolio administrable sans dériver vers un CMS générique.
- Préserver la simplicité d'exploitation et le budget limité.
- Garantir que les contenus brouillons, archivés ou non publiés ne sont jamais exposés publiquement.
- Protéger l'administration, les messages et les médias.
- Permettre le français et l'anglais comme contenus métier, pas seulement comme traduction d'interface.
- Fournir des pages publiques indexables.

## Vue logique

```text
Navigateur
  ├─ Site public Angular SSR/prérendu
  └─ Administration Angular CSR
        │
        ▼
API REST Spring Boot
  ├─ Modules publics en lecture
  ├─ Modules admin protégés
  ├─ Authentification et session
  ├─ Publication / i18n / médias
  └─ Journal d'activité
        │
        ▼
PostgreSQL + stockage médias
```

## Couches

| Couche | Décision |
|--------|----------|
| Frontend | Angular 20 compatible, TypeScript strict, standalone, zoneless lorsque compatible, SCSS, Tailwind CSS, PrimeNG, ngx-translate |
| Rendu public | Angular SSR/prérendu pour les pages publiques indexables ; admin en rendu client |
| Backend | Java 21, Spring Boot 4 compatible, Spring Security, Spring Data JPA, Bean Validation |
| API | REST JSON, DTO d'entrée/sortie, validation serveur, erreurs uniformes |
| Base | PostgreSQL, migrations versionnées |
| Médias | Stockage filesystem persistant pour MVP, métadonnées en base |
| Déploiement | Docker Compose avec reverse proxy HTTPS |

## Modules backend

- `identity` : profil, coordonnées, réseaux, CV.
- `content` : sections, publication, traductions.
- `skills` : catégories et compétences.
- `experience` : expériences, formations, certifications.
- `projects` : projets, études de cas, technologies, mise en avant.
- `services` : services proposés.
- `contact` : messages, statuts, anti-spam minimal.
- `media` : métadonnées, upload, usages, validation.
- `seo` : métadonnées, indexation, sitemap.
- `settings` : paramètres généraux.
- `auth` : administrateur unique, session, mot de passe.
- `audit` : journal d'activité.

## Frontières

- Les contrôleurs REST ne contiennent pas de logique métier.
- Les modules publics exposent seulement les contenus publiés et traduits pour la langue demandée.
- Les modules admin nécessitent une session administrateur valide.
- Les médias privés ou non publiés ne sont pas servis publiquement.
- Les intégrations e-mail, stockage et analytics passent par des ports dédiés.

## Contraintes de simplicité

- Pas de microservices.
- Pas de Kubernetes.
- Pas de multi-tenant.
- Pas de rôles complexes.
- Pas de synchronisation automatique complète avec LinkedIn/GitHub.
- Pas de moteur CMS générique.

## ADR liés

- ADR-0001 — Stack et architecture globale du MVP
- ADR-0002 — Stratégie de rendu public Angular
- ADR-0003 — Authentification administrateur
- ADR-0004 — Publication et internationalisation des contenus
- ADR-0005 — Stockage et sécurité des médias
- ADR-0006 — Contact, e-mail et anti-spam
- ADR-0007 — Déploiement Docker Compose

## Dernière mise à jour

2026-07-21
