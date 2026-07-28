# Rapport d'implémentation — Sous-phase 5.4

## Objectif

Livrer la gestion administrable des catégories de compétences et des compétences, avec API admin/public, modèle relationnel, publication, traductions FR/EN, ordre, mise en avant, section publique et conformité PrimeNG des sélections.

## Périmètre réalisé

- Catégories de compétences : création, modification, publication, dépublication, archivage, suppression contrôlée, ordre, traductions.
- Compétences : création, modification, publication, dépublication, archivage, ordre, niveau qualitatif, mise en avant, visibilité, traductions.
- API publique : exposition des compétences publiées groupées par catégorie publiée et langue demandée.
- Interface admin : tables PrimeNG, filtres PrimeNG, dialogues de formulaire, confirmations, états loading/empty/error/success.
- Section publique : affichage des compétences publiées sans jauges ni pourcentages.

## Fichiers créés

- `backend/src/main/java/com/faouzi/portfolio/skills/application/SkillCatalogService.java`
- `backend/src/main/java/com/faouzi/portfolio/skills/api/*Skill*.java`
- `backend/src/main/java/com/faouzi/portfolio/skills/domain/SkillRepository.java`
- `backend/src/main/java/com/faouzi/portfolio/skills/domain/SkillCategoryTranslationRepository.java`
- `backend/src/main/java/com/faouzi/portfolio/skills/domain/SkillTranslationRepository.java`
- `backend/src/test/java/com/faouzi/portfolio/skills/SkillCatalogControllerTests.java`
- `frontend/src/app/admin/skills/skills.models.ts`
- `frontend/src/app/admin/skills/skills-api.service.ts`
- `frontend/src/app/admin/skills/skills-api.service.spec.ts`
- `frontend/src/app/admin/skills/skills.page.ts`
- `frontend/src/app/admin/skills/skills.page.spec.ts`
- `docs/api/postman-skills.postman_collection.json`

## Fichiers modifiés

- `backend/src/main/java/com/faouzi/portfolio/shared/security/SecurityConfiguration.java`
- `frontend/src/app/app.config.ts`
- `frontend/src/app/app.routes.ts`
- `frontend/src/app/admin/shell/admin-navigation.ts`
- `frontend/src/app/public/public-placeholder.page.ts`
- `frontend/src/app/public/public-placeholder.page.spec.ts`
- `frontend/src/styles.scss`
- Documents projet, ADR, QA, UX, sécurité et états `.agents/state`.

## Décisions techniques

- Réutilisation du domaine `skills` et de la migration `V4__skills.sql` existants.
- Modèle relationnel dédié, sans table clé-valeur ni JSON métier.
- Publication publique stricte : ressource `PUBLISHED`, catégorie `PUBLISHED`, compétence visible et traduction complète dans la langue demandée.
- Pas de fallback français automatique pour les contenus métier publics.
- Sélections frontend via PrimeNG, sans `<select>` natif dans le périmètre 5.4.

## Tests exécutés

| Vérification | Résultat |
|--------------|----------|
| Backend `mvn test` | PASS — 22 tests |
| Backend `mvn package` | PASS — 22 tests |
| Frontend `npm run lint` avec Node 20 temporaire | PASS |
| Frontend `npm run test:ci` avec Node 20 temporaire | PASS — 24 tests |
| Frontend `npm run build` avec Node 20 temporaire | PASS avec warning budget initial +2,94 kB |
| Audit natif `<select>/<option>` périmètre 5.4 | PASS |

## Vérifications non exécutées

- Inspection visuelle navigateur réelle : non exécutée.
- Docker runtime complet : build interrompu après téléchargement très lent d'une couche Maven ; backend local non démarrable sans PostgreSQL local disponible.
- Tests E2E Playwright/axe : outillage non installé.

## Risques résiduels

- Responsive et overlays PrimeNG validés par structure, tests et build, mais non inspectés visuellement dans le navigateur.
- Budget Angular initial légèrement dépassé.
- Sélecteurs natifs hors périmètre 5.4 restent dans les pages profil/paramètres.

## Verdict

`CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`
