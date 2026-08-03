# Dette technique

## Dette active

| ID | Description | Module | Impact | Priorité | Date identification |
|----|-------------|--------|--------|----------|---------------------|
| TD-001 | Node local `18.19.1` incompatible avec Angular 20 ; les commandes ont été vérifiées via Node 20 temporaire | Frontend/outillage | Moyen | Haute avant développement frontend soutenu | 2026-07-21 |
| TD-002 | `npm audit` signale 3 vulnérabilités modérées dans le tooling Angular CLI ; correctif proposé force Angular CLI 21 | Frontend/outillage | Moyen | Moyenne | 2026-07-21 |
| TD-004 | Aucun harnais E2E/accessibilité outillé n'est encore installé pour automatiser les parcours admin responsive et axe | Frontend/QA | Moyen | Haute avant release | 2026-07-22 |
| TD-007 | Le build Angular passe avec un warning de budget initial dépassé de 16,84 kB après la correction formulaires | Frontend/performance | Faible à moyen | Moyenne avant release | 2026-08-02 |
| TD-008 | Aucun outil E2E visuel avec authentification admin n'est encore configuré ; l'inspection formulaires du 2026-08-02 a utilisé un mock API et Chrome DevTools temporaire | Frontend/QA | Moyen | Haute avant release | 2026-08-02 |
| TD-009 | `ProjectService.uploadMedia` code en dur la limite de galerie à `12` au lieu de réutiliser `ProjectMediaProperties.maxGalleryItems()` | Backend/project | Faible | Moyenne | 2026-08-02 |
| TD-010 | `ProjectMapper.skillReference`/`categoryName` retournent la traduction compétence/catégorie codée en `"fr"` indépendamment de la langue demandée ; motif identique et préexistant dans `CareerMapper` | Backend/project, career | Faible à moyen | Moyenne | 2026-08-02 |
| TD-011 | Build Angular passe avec un warning de budget initial dépassé de 20,54 kB après l'ajout du module projets | Frontend/performance | Faible à moyen | Moyenne avant release | 2026-08-02 |
| TD-012 | Validation visuelle interactive non exécutée pour le module projets (aucun navigateur/outil de capture disponible dans cet environnement) | Frontend/QA | Moyen | Haute avant release | 2026-08-02 |
| TD-013 | Build Angular passe avec un warning de budget initial dépassé de 22,75 kB après l'ajout du module services | Frontend/performance | Faible à moyen | Moyenne avant release | 2026-08-03 |
| TD-014 | Aucun harnais E2E authentifié n'est disponible pour capturer automatiquement `/admin/services` et ses modales ; la tentative CDP temporaire 5.7 est restée bloquée | Frontend/QA | Moyen | Haute avant release | 2026-08-03 |

## Dette résolue

| ID | Description | Date résolution |
|----|-------------|-----------------|
| TD-003 | Build Docker images non validé faute d'accès Docker Hub | 2026-07-21 |
| TD-005 | Les routes admin protégées étaient validées en navigation SPA mais le reload direct via SSR/dev proxy devait être traité | 2026-07-22 |
| TD-006 | Les pages profil/paramètres héritées de 5.3 contenaient encore des `<select>/<option>` natifs hors périmètre 5.4 | 2026-07-26 |

## Dernière mise à jour

2026-08-03 (ajout TD-013 à TD-014 — sous-phase 5.7)
