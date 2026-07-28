# Dette technique

## Dette active

| ID | Description | Module | Impact | Priorité | Date identification |
|----|-------------|--------|--------|----------|---------------------|
| TD-001 | Node local `18.19.1` incompatible avec Angular 20 ; les commandes ont été vérifiées via Node 20 temporaire | Frontend/outillage | Moyen | Haute avant développement frontend soutenu | 2026-07-21 |
| TD-002 | `npm audit` signale 3 vulnérabilités modérées dans le tooling Angular CLI ; correctif proposé force Angular CLI 21 | Frontend/outillage | Moyen | Moyenne | 2026-07-21 |
| TD-004 | Aucun harnais E2E/accessibilité outillé n'est encore installé pour automatiser les parcours admin responsive et axe | Frontend/QA | Moyen | Haute avant release | 2026-07-22 |
| TD-007 | Le build Angular passe avec un warning de budget initial dépassé de 4,76 kB après la sous-phase 5.5 | Frontend/performance | Faible à moyen | Moyenne avant release | 2026-07-26 |
| TD-008 | Aucun outil E2E visuel avec authentification admin n'est encore configuré ; l'inspection 5.5 des écrans admin a reposé sur tests composants ChromeHeadless et routes HTTP | Frontend/QA | Moyen | Haute avant release | 2026-07-26 |

## Dette résolue

| ID | Description | Date résolution |
|----|-------------|-----------------|
| TD-003 | Build Docker images non validé faute d'accès Docker Hub | 2026-07-21 |
| TD-005 | Les routes admin protégées étaient validées en navigation SPA mais le reload direct via SSR/dev proxy devait être traité | 2026-07-22 |
| TD-006 | Les pages profil/paramètres héritées de 5.3 contenaient encore des `<select>/<option>` natifs hors périmètre 5.4 | 2026-07-26 |

## Dernière mise à jour

2026-07-26
