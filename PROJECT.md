# PROJECT

## Nom

Portfolio professionnel — Faouzi El Mansour

## Problème

Dispersion des informations professionnelles empêchant une évaluation rapide et crédible du profil, des compétences et des réalisations.

## Cible

Recruteurs/RH, responsables techniques, clients/partenaires (visiteurs publics) ; administrateur unique (propriétaire).

## Proposition de valeur

Portfolio administrable, multilingue, sécurisé, premium, orienté preuves concrètes — sans contenu fictif.

## Acteurs

Voir `docs/product/actors-and-roles.md` (contenu à resynchroniser — voir `.agents/state/PHASE_1_REPORT.md`).

## MVP

Voir `docs/product/scope.md` (contenu à resynchroniser — voir `.agents/state/PHASE_1_REPORT.md`).

## Exclusions

Multi-admin, blog, paiement, microservices, témoignages fictifs, CRM — voir Phase 1 report.

## Technologies

| Couche | Technologie | Statut |
|--------|-------------|--------|
| Frontend | Angular 20.3, TypeScript strict, SSR, SCSS, Tailwind, PrimeNG, ngx-translate | Implémenté |
| Backend | Java 21, Spring Boot 4.0.1, JPA, Flyway | Implémenté |
| Base de données | PostgreSQL (H2 en test) | Implémenté |
| Infrastructure | Docker Compose | Configuré |

## Architecture

Monolithe modulaire par domaine — voir ADR-0001, ADR-0012 et `docs/architecture/`.

### Modules backend

`auth`, `profile`, `skills`, `career`, `project`, `service`, `contact`, `audit`, `shared`

### Modules frontend

`public/home` (landing premium recadrée 2026-08-29), `public/contact`, `public/legal`, `public/projects`, `admin/*`

### Structure landing (benchmark 2026)

Hero → À propos → Projets → Compétences → Parcours → Services → Méthode → Contact — voir `docs/product/portfolio-structure-benchmark.md`

## État

- Mode : Projet existant (Mode C)
- Dernière sous-phase clôturée : 5.9 — Contact (2026-08-29)
- Phase 5 (implémentation MVP) : **clôturée**
- Statut global : `PHASE_CLÔTURÉE_EN_ATTENTE_DU_GO_HUMAIN` (Phase 6 en attente)

## Contraintes

Un administrateur, FR/EN, SEO public, sécurité admin, anti-spam contact — voir ADR et brief.

## Risques

Voir `.agents/state/RISKS.md`

## Dette technique

Voir `.agents/state/TECHNICAL_DEBT.md`

## Commandes utiles

```bash
# Backend
cd backend && mvn test

# Frontend (Node 20+ requis)
source ~/.nvm/nvm.sh && nvm use 20
cd frontend && npm run lint && npm run test:ci && npm run build

# Infrastructure
docker compose up -d
```

## Liens utiles

- Gouvernance : `AGENTS.md`
- Plan : `PLANS.md`
- État : `.agents/state/PROJECT_STATE.md`
- Handoff : `.agents/state/HANDOFF.md`
- ADR : `docs/adr/`
- API : `docs/api/README.md`

## Dernière mise à jour

2026-08-29
