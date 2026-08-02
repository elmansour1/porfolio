# Rapport d'implémentation — Sous-phase 5.6

## Objectif

Livrer la gestion des projets et études de cas : API admin/public, persistance, médias (couverture + galerie), administration PrimeNG et affichage public, en réutilisant les mécanismes existants de traduction, publication, ordre et référentiel de compétences.

## Périmètre réalisé

- Module backend `project` par domaine (`api`, `application`, `domain`, `infrastructure`, `config`).
- Migration `V6__projects.sql` (projets, traductions, médias, liens, compétences liées).
- API admin `/api/v1/admin/projects` : CRUD, publication/dépublication/archivage, mise en avant, ordre, upload/suppression/réordonnancement média, lecture média admin.
- API publique `/api/v1/public/projects` : liste paginée avec filtre par compétence, projets mis en avant, détail par slug, lecture média public.
- Gestion média projet dédiée (`ProjectMediaStorageService`) : couverture unique + galerie multiple, whitelist de type/taille, noms assainis, protection anti path-traversal.
- Confidentialité dédiée (`ProjectConfidentiality` : `PUBLIC`/`ANONYMIZED`/`PRIVATE`) masquant liens/URLs en mode anonymisé et excluant totalement le mode privé des réponses publiques.
- Page admin `/admin/projects` : liste, formulaire multi-sections (informations, période, confidentialité/publication, traductions FR/EN, compétences, liens, galerie).
- Pages publiques `/projects` (liste avec pagination) et `/projects/:slug` (détail avec galerie et SEO minimal).
- Tests backend et frontend ciblés.

## Fichiers principaux

- `backend/src/main/java/com/faouzi/portfolio/project/**`
- `backend/src/main/resources/db/migration/V6__projects.sql`
- `backend/src/test/java/com/faouzi/portfolio/project/ProjectControllerTests.java`
- `frontend/src/app/admin/projects/**`
- `frontend/src/app/public/projects/**`
- `frontend/src/styles.scss`

## Décisions techniques

- `ProjectRequest` (DTO d'entrée API) réutilisé tel quel pour la création et la modification, par cohérence avec le motif déjà utilisé côté `career`/`skills` : identifiant serveur-généré et slug revalidé à chaque écriture (`existsBySlug`/`existsBySlugAndIdNot`), sans risque de falsification côté client.
- Réutilisation intégrale du référentiel de compétences existant (`skills`) pour les technologies liées aux projets, sans duplication de modèle.
- Réutilisation de l'énumération partagée `PublicationStatus` (`profile.domain.model`) pour le cycle de vie DRAFT/PUBLISHED/ARCHIVED.
- Confidentialité modélisée par une énumération dédiée au module (`PUBLIC`/`ANONYMIZED`/`PRIVATE`), appliquée uniquement côté service applicatif (`ProjectService`), jamais dans les contrôleurs ou mappers.
- Médias projet séparés en deux natures (`COVER`/`GALLERY`) avec ordre explicite pour la galerie.
- SEO limité au strict périmètre autorisé : titre et description par projet via `Meta`/`Title`, sans stratégie SEO globale.

## Tests exécutés

- Backend `mvn test` : PASS, 34 tests (dont 8 nouveaux tests `ProjectControllerTests`).
- Frontend `npx eslint .` : PASS.
- Frontend `npx ng test --watch=false --browsers=ChromeHeadless` : PASS, 37 tests.
- Frontend `npx ng build` : PASS avec avertissement de budget initial dépassé de 20,54 kB.

## Vérifications non exécutées

- Inspection visuelle interactive en navigateur (aucun outil de capture d'écran disponible dans cet environnement pour ce périmètre) — voir `PHASE_5_6_UX_UI_AUDIT.md`.
- E2E axe/Lighthouse : outillage non installé (dette technique déjà tracée).
- Vérification runtime Docker complète (non rejouée dans cette session ; dernière vérification Docker complète effectuée en 5.5).

## Déviation documentée

- Réutilisation d'un DTO d'entrée unique (`ProjectRequest`) pour création et modification, plutôt que deux DTO distincts (`CreateProjectRequest`/`UpdateProjectRequest`). Ce choix suit le motif déjà en place pour `career` et `skills` dans ce projet ; il est sans risque puisque l'identifiant est serveur-généré et le slug revalidé à chaque écriture.

## Verdict

`CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`
