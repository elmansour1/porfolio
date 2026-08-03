# Rapport d'implémentation — Sous-phase 5.7

## Statut

`DONE` — 2026-08-03

## Périmètre livré

- Domaine backend `service` pour services professionnels et méthode de travail.
- Migration `V7__professional_services.sql` avec services, traductions, bénéfices, livrables, relations compétences/technologies, étapes de méthode et contraintes.
- API admin : `/api/v1/admin/services`, `/api/v1/admin/work-process-steps`.
- API publique : `/api/v1/public/services`, `/featured`, `/{slug}`, `/work-process/steps`.
- Feature frontend `admin/services` avec DTO, formulaires typés, mapper, client API, page admin PrimeNG.
- Sections publiques Services et Méthode alimentées par API.
- ADR-0013 créé.

## Décisions appliquées

- Référentiel `skill` réutilisé pour compétences et technologies, sans table parallèle.
- Bénéfices et livrables structurés et traduits séparément.
- Publication explicite ; brouillons et archives exclus publiquement.
- CTA typés et validés côté backend.
- Services initiaux conservateurs, sans tarifs, délais garantis, faux clients ni promesses chiffrées.

## Vérifications

| Vérification | Résultat |
|--------------|----------|
| Backend `mvn test` | PASS — 40 tests |
| Frontend `npm run lint` avec Node 20 | PASS |
| Frontend `npm run test:ci` avec Node 20 | PASS — 42 tests |
| Frontend `npm run build` avec Node 20 | PASS avec warning budget +22,75 kB |
| Scan `<select>/<option>` périmètre 5.7 | PASS |
| Scan Lombok interdit périmètre backend service | PASS |
| API publique runtime H2/SSR | PASS |
| Inspection visuelle publique desktop/mobile | PASS |

## Réserves

- Inspection visuelle admin authentifiée Services/Méthode non capturée : le script CDP temporaire est resté bloqué. Tests composants, lint et revue statique couvrent le périmètre en attendant Playwright/axe.
- Warning budget Angular initial +22,75 kB.
