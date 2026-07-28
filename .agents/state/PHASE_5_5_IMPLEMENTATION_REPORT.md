# Rapport d'implémentation — Sous-phase 5.5

## Objectif

Livrer la gestion des expériences, formations et certifications, avec API admin/public, persistance, administration PrimeNG et affichage public.

## Périmètre réalisé

- Module backend `career` par domaine.
- Migration `V5__career_timeline.sql`.
- API admin expériences, formations, certifications et métadonnées.
- API publique `/api/v1/public/career`.
- Page admin `/admin/experiences`, `/admin/education`, `/admin/certifications`.
- Affichage public du parcours publié dans la page publique existante.
- Tests backend et frontend ciblés.

## Fichiers principaux

- `backend/src/main/java/com/faouzi/portfolio/career/**`
- `backend/src/main/resources/db/migration/V5__career_timeline.sql`
- `backend/src/test/java/com/faouzi/portfolio/career/CareerTimelineControllerTests.java`
- `frontend/src/app/admin/career/**`
- `frontend/src/app/public/public-placeholder.page.ts`
- `frontend/src/styles.scss`

## Décisions techniques

- Dates en précision jour, sans dates partielles implicites.
- Réutilisation du référentiel compétences existant pour les technologies liées.
- Confidentialité appliquée côté backend dans l'API publique.
- Suppression définitive du modèle backend inutilisé `CareerTranslationValues`.

## Tests exécutés

- Backend `mvn package` : PASS, 26 tests.
- Frontend `npm run lint` : PASS.
- Frontend `npx -y -p node@20 -p npm@10 npm run test:ci` : PASS, 29 tests.
- Frontend `npx -y -p node@20 -p npm@10 npm run build` : PASS avec warning budget.
- Docker `docker compose build api web` : PASS.
- Docker `docker compose up -d` : PASS, services healthy.

## Vérifications non exécutées

- Connexion navigateur aux écrans admin authentifiés 5.5 : non exécutée, car le volume Docker contient déjà un administrateur dont le mot de passe n'est pas connu. Le bootstrap a été ignoré.
- E2E axe/Lighthouse : outillage non installé.

## Verdict

`CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`
