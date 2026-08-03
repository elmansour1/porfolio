# Rapport d’inspection visuelle — Sous-phase 5.8

## Environnement

- Backend : `mvn spring-boot:test-run`, profil `test`, H2, port 8080.
- Frontend : `npm run serve:ssr`, `API_ORIGIN=http://localhost:8080`, port 4100.
- Navigateur : Chrome headless.

## Captures

- Desktop : `/tmp/home-desktop-final.png`, `/tmp/home-desktop-after-review.png`.
- Mobile : `/tmp/home-mobile-final.png`, `/tmp/home-mobile-after-review.png`.
- Menu mobile ouvert : `/tmp/home-mobile-menu.png`.
- Pleine page : `/tmp/home-fullpage.png`.
- Reduced motion : `/tmp/home-reduced-motion-final.png`.
- Tablette : `/tmp/home-tablet-final.png`.

## Résultats

- Header initial : PASS.
- Menu mobile : PASS.
- Hero : PASS après réduction de hauteur et visuel mobile.
- Services : PASS.
- Méthode : PASS.
- Contact/CTA : PASS, avec CTA conditionnels.
- Responsive mobile/tablette/desktop : PASS.
- Navigation clavier : PASS.
- Reduced motion : PASS.
- HTML SSR : PASS.

## Réserve

Le profil public principal n'était pas publié dans les données H2. Les sections profil complet, stats, à propos, compétences, parcours et projets réels doivent être recapturées avec un profil publié avant mise en ligne.

