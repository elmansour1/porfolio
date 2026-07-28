# État du projet

## Statut global

`PHASE_CLÔTURÉE_EN_ATTENTE_DU_GO_HUMAIN`

## Mode détecté

`NOUVEAU_PROJET` (Mode B)

## Phase autorisée

Sous-phase 5.5 — Expériences, formations et certifications (clôturée).

## Phase en cours

Aucune.

## Dernière phase clôturée

Sous-phase 5.5 — Expériences, formations et certifications (clôturée le 2026-07-26).

## Dernier GO reçu

2026-07-26 — `GO pour la sous-phase 5.5 — Gestion des expériences professionnelles, des formations et des certifications`, avec exécution autonome, audits après chaque étape, corrections du périmètre, documentation et arrêt sans lancer la sous-phase 5.6.

## Étapes terminées

| ID | Titre | État | Audit |
|----|-------|------|-------|
| 0.1 à 5.2.7 | Phases et sous-phases précédentes | DONE | Voir rapports précédents |
| 5.3.1 | Cadrage Product/Domain/UX/Security et contrats de profil | DONE | CONFORME |
| 5.3.2 | Modèle de données, migrations, médias et contraintes | DONE | CONFORME |
| 5.3.3 | API backend admin/public, validations, journalisation et tests | DONE | CONFORME |
| 5.3.4 | Pages admin Profil et Paramètres avec formulaires typés | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.3.5 | Affichage public des données publiables du profil | DONE | CONFORME |
| 5.3.6 | Builds, tests, gates frontend/backend et corrections | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.3.7 | Inspection visuelle, accessibilité et audit UX/UI SaaS premium | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.3.8 | Documentation, handoff, audit final et arrêt | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.4.1 | Cadrage Product/Domain/UX/Security et audit des sélections natives | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.4.2 | Modèle de données, migration compétences et contraintes | DONE | CONFORME |
| 5.4.3 | API backend admin/public, validations, publication, ordre et tests | DONE | CONFORME |
| 5.4.4 | Interface admin catégories/compétences avec PrimeNG | DONE | CONFORME |
| 5.4.5 | Section publique compétences et règles de visibilité | DONE | CONFORME |
| 5.4.6 | Builds, tests, conformité PrimeNG et corrections | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.4.7 | Inspection visuelle, accessibilité et audit UX/UI SaaS premium | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.4.8 | Documentation, handoff, audit final et arrêt | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| R-ARCH-1 | Audit architecture actuelle backend/frontend | DONE | CONFORME |
| R-ARCH-2 | Restructuration backend par domaines, DTO, mappers et Lombok | DONE | CONFORME |
| R-ARCH-3 | Restructuration frontend DTO, formulaires, mappers, shared UI et PrimeNG | DONE | CONFORME |
| R-ARCH-4 | Builds, tests, scans qualité, documentation et audit final | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.5.1 | Cadrage Product/Domain/UX/Security et audit des composants natifs | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.5.2 | Modèle de données, migration parcours et contraintes | DONE | CONFORME |
| 5.5.3 | API backend admin/public, validations, confidentialité, ordre et tests | DONE | CONFORME |
| 5.5.4 | Interface admin parcours avec PrimeNG selects, multiselects et datepickers | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.5.5 | Affichage public du parcours publié | DONE | CONFORME |
| 5.5.6 | Builds, tests, Docker, conformité PrimeNG et corrections | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.5.7 | Inspection visuelle, accessibilité et audit UX/UI SaaS premium | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 5.5.8 | Documentation, handoff, audit final et arrêt | DONE | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

## Audits récents

| Date | Périmètre | Verdict |
|------|-----------|---------|
| 2026-07-21 | Sous-phase 5.1 — Authentification administrateur | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2026-07-22 | Sous-phase 5.2 — Layout et dashboard admin | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2026-07-22 | Sous-phase 5.3 — Profil professionnel et paramètres généraux | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2026-07-26 | Sous-phase 5.4 — Compétences et catégories | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2026-07-26 | Correctif structure backend/frontend — DTO, repositories, feature folders et PrimeNG selects | CONFORME |
| 2026-07-26 | Correctif DTO frontend — `models/dto` et DTO hors services API | CONFORME |
| 2026-07-26 | Correctif modèles backend et DTO applicatifs — `domain/model` et `application/dto` | CONFORME |
| 2026-07-26 | Intervention exceptionnelle — Restructuration architecturale senior du projet | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |
| 2026-07-26 | Sous-phase 5.5 — Expériences, formations et certifications | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

## Blocages

Aucun blocage empêchant la clôture.

Réserves tracées :

- `npm audit --audit-level=moderate` signale 3 vulnérabilités modérées dans la chaîne de développement Angular CLI/MCP/`@hono/node-server`; correction différée car `npm audit fix --force` force Angular CLI 21.
- Node local `18.19.1` est incompatible Angular 20 ; les commandes frontend ont été exécutées avec Node 20 temporaire via `npx`.
- L'inspection visuelle réelle 5.4 n'a pas été exécutée : le build Docker est resté bloqué sur le téléchargement lent d'une couche Maven, et le backend local ne pouvait pas démarrer sans PostgreSQL disponible.
- Le build Angular passe avec un warning de budget initial dépassé de 4,76 kB après la sous-phase 5.5.
- Les `<select>/<option>` natifs hérités de 5.3 ont été remplacés par `p-select` lors du correctif qualité post-clôture du 2026-07-26.
- Les DTO REST backend sont dans `api.dto.request` et `api.dto.response`; les entités JPA ne sont pas renommées en DTO JPA et restent dans `domain.model`.
- Les DTO frontend consommés par les services API sont dans `models/dto`.
- Les modèles backend sont dans `domain.model`; les DTO applicatifs utilisés par les services sont dans `application.dto`.
- Inspection visuelle 5.5 : captures headless exécutées pour `/` desktop et `/admin/login` mobile. Les écrans admin authentifiés 5.5 n'ont pas été inspectés via navigateur réel car le volume Docker contient déjà un administrateur dont le mot de passe n'est pas connu ; le bootstrap local a donc été ignoré.
- Docker 5.5 : `docker compose build api web` PASS, `docker compose up -d` PASS, routes `/`, `/admin/login`, `/admin/dashboard`, `/admin/experiences`, `/admin/education`, `/admin/certifications` répondent `200`; API publique `/api/v1/public/career?lang=fr` répond `200`.

## Risques actifs

Voir `.agents/state/RISKS.md`.

## Prochaine action autorisée

Attendre un `GO` humain explicite pour la sous-phase 5.6 ou une sous-phase nommée.

La sous-phase 5.6 n'est pas autorisée. Aucun CRUD projets, services, témoignages, contact, messages, médiathèque complète ou SEO avancé ne doit être commencé.

## Dernière mise à jour

2026-07-26
