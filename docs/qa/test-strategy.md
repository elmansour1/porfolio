# Stratégie de test

## Statut

Mise à jour en sous-phase 5.2 — Layout et dashboard admin.

## Objectif

Vérifier les comportements critiques du portfolio public, de l'administration, de la sécurité, des médias, du SEO et de la publication.

## Niveaux de test

| Niveau | Périmètre | Outil cible à confirmer |
|--------|-----------|-------------------------|
| Unit backend | Règles publication, i18n, statuts, validations | JUnit + AssertJ |
| Integration backend | JPA, PostgreSQL, migrations, transactions, sécurité | Spring Boot Test + Testcontainers |
| API | Contrats, erreurs, permissions, pagination | MockMvc/RestAssured + Postman |
| Unit frontend | Composants, services, formulaires, guards | Angular testing stack |
| E2E | Landing, projet détail, contact, login admin, publication, messages, upload | Playwright ou équivalent |
| Sécurité | Auth, CSRF, upload, XSS, rate limit | Tests automatisés + revue |
| Accessibilité | Clavier, focus, labels, contrastes | Axe/Lighthouse + inspection |
| Responsive | 360px, 768px, 1366px, 1440px+ | Playwright screenshots |

## Parcours critiques

- Chargement landing publique.
- Changement FR/EN.
- Consultation projet publié.
- Soumission contact.
- Login/logout admin.
- Accès admin anonyme refusé.
- Publication/dépublication.
- Gestion messages.
- Upload média valide.
- Refus média invalide.
- Métadonnées SEO.

## Tests sécurité obligatoires

- Accès `/api/v1/admin/**` anonyme refusé.
- CSRF requis sur écritures admin.
- Session expirée.
- Logout invalide la session.
- Tentatives login limitées.
- XSS dans contenu administré échappé.
- Upload MIME trompeur refusé.
- Fichier trop lourd refusé.
- Messages jamais publics.

## Gates avant release

- Build frontend/backend.
- Tests unitaires.
- Tests intégration backend.
- Tests API.
- Tests E2E critiques.
- Audit accessibilité.
- Audit responsive.
- Audit sécurité.
- Inspection visuelle réelle.

## Tests non exécutables en Phase 2

Aucun test applicatif n'est exécutable tant que le code produit n'existe pas. Les tests ci-dessus deviennent obligatoires à partir des phases techniques concernées.

## Tests exécutés en Phase 4

| Niveau | Commande | Résultat |
|--------|----------|----------|
| Backend build + tests | `mvn package` | PASS — 5 tests |
| Backend sécurité minimale | MockMvc `/api/v1/admin/**` anonyme | PASS — `401` |
| Backend migration | Flyway H2 test profile | PASS — 1 migration |
| Frontend lint | `npm run lint` | PASS |
| Frontend unit/component | `npm run test:ci` | PASS — 4 tests Chrome Headless |
| Frontend build SSR | `npm run build` | PASS |
| Docker config | `docker compose config` | PASS |
| Docker image build | `docker compose build` | NOT EXECUTED — Docker Hub inaccessible |
| Inspection visuelle | Chrome headless screenshots | PASS — placeholders public/admin |

## Tests exécutés en Phase 5.1

| Niveau | Commande | Résultat |
|--------|----------|----------|
| Backend build + tests | `mvn package` | PASS — 12 tests |
| Backend auth API | MockMvc login/logout/me/reset/csrf | PASS |
| Backend sécurité | CSRF requis, admin anonyme `401`, verrouillage après échecs | PASS |
| Backend migration | Flyway H2 test profile | PASS — 2 migrations |
| Frontend lint | `npm run lint` | PASS |
| Frontend unit/component | `npm run test:ci` | PASS — 9 tests Chrome Headless |
| Frontend build SSR | `npm run build` | PASS |
| Docker config | `docker compose config` | PASS |
| Docker image build | `docker compose build` | PASS |
| npm audit | `npm audit --audit-level=moderate` | FAIL — 3 vulnérabilités modérées tooling Angular CLI |
| Inspection visuelle | Chrome headless screenshots | PASS — login desktop, forgot/reset mobile, session/forbidden |

## Tests exécutés en Phase 5.2

| Niveau | Commande | Résultat |
|--------|----------|----------|
| Backend non-régression auth | `mvn package` | PASS — 12 tests |
| Frontend lint | `npm run lint` | PASS |
| Frontend unit/component/guard | `npm run test:ci` | PASS — 17 tests Chrome Headless |
| Frontend build SSR | `npm run build` | PASS |
| Frontend security tooling | `npm audit --audit-level=moderate` | FAIL — 3 vulnérabilités modérées tooling Angular CLI |
| Inspection visuelle authentifiée | Chrome DevTools headless + backend Docker | PASS — dashboard desktop/laptop/tablette/mobile, menu mobile, 404 admin, 403, session expirée |

Corrections issues des audits 5.2 :

- ignore ESLint ajouté pour `.angular`, `dist`, `coverage` et `node_modules` afin d'éviter le lint des caches générés ;
- breakpoint tablette corrigé pour éviter le débordement des panneaux inférieurs ;
- état désactivé des actions rapides rendu plus explicite ;
- compte admin temporaire d'inspection supprimé de la base Docker locale après vérification.

## Réserves Phase 4

- `npm audit` signale 3 vulnérabilités modérées dans une chaîne de dépendances de `@angular/cli`; le correctif proposé force Angular CLI 21, non validé par ADR.
- Les tests E2E, accessibilité outillée complète, responsive complet et sécurité métier restent hors périmètre tant que les fonctionnalités métier n'existent pas.

## Réserves Phase 5.1

- `npm audit` conserve 3 vulnérabilités modérées dans la chaîne Angular CLI ; correction différée sans migration Angular CLI 21 validée.
- Le canal de remise du jeton de reset en production reste à décider ; l'API n'expose pas le jeton par défaut.
- Tests E2E navigateur avec backend réel non exécutés ; la couverture actuelle combine MockMvc backend, tests Angular et inspection SSR.

## Réserves Phase 5.2

- `npm audit` conserve 3 vulnérabilités modérées dans la chaîne Angular CLI ; correction différée sans migration Angular CLI 21 validée.
- Audit accessibilité outillé complet non exécuté ; vérification statique, tests composants et inspection visuelle réalisés.
- Le scénario reload complet `/admin/dashboard` via dev proxy headless a renvoyé au login car le cookie `HttpOnly` n'était pas conservé dans cette configuration d'inspection ; la navigation SPA authentifiée, les guards et les tests API restent validés.

## Dernière mise à jour

2026-07-22
