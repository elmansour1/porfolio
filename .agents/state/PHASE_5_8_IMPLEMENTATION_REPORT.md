# Rapport d’implémentation — Sous-phase 5.8

## Périmètre livré

- Remplacement de `PublicPlaceholderPage` par une feature `public/home`.
- Page `/` composée de sections autonomes : header, hero, about, skills, projects, career, services, work process, CTA collaboration et footer.
- Data-access centralisé qui charge le portfolio public puis les sections visibles.
- Route racine en `RenderMode.Server`.
- États chargement, erreur globale, erreur partielle, profil non publié et sections vides.
- CTA conditionnels : aucun bouton ne pointe vers une ancre désactivée.
- Tests Angular dédiés à la landing.

## Fichiers principaux

- `frontend/src/app/public/home/**`
- `frontend/src/app/app.routes.ts`
- `frontend/src/app/app.routes.server.ts`
- `frontend/src/styles.scss`

## Exclusions respectées

Aucun formulaire de contact complet, message, témoignage, paiement, réservation, blog, newsletter, nouvelle gestion de contenu ou endpoint backend agrégé n'a été développé.

## Vérifications

- `npm run lint` : PASS.
- `npm run test:ci` avec Node 20 : PASS — 48 tests.
- `npm run build` avec Node 20 : PASS avec warning budget initial 534,21 kB > 500 kB.
- `mvn test` backend : PASS — 40 tests.
- Endpoints publics H2 : PASS HTTP 200.
- HTML SSR `/` : PASS HTTP 200, titre non provisoire, aucune occurrence `/api/v1/admin` ni `/admin/login`.

## Réserves

- Data-access public encore couplé aux services API situés sous `admin/**`.
- Rendu complet avec profil réel publié à inspecter avant mise en ligne.
- Budget initial Angular dépassé de 34,21 kB.

