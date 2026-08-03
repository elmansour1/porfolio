# Rapport d'inspection visuelle — Sous-phase 5.7

## Verdict

`CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`

## Environnement

- Backend : `mvn spring-boot:test-run`, profil `test`, H2, Flyway V1 à V7.
- Frontend : Angular SSR `npm run serve:ssr`, `API_ORIGIN=http://localhost:8080`.
- Navigateur : `google-chrome --headless`.

## Captures exécutées

| Vue | Résultat | Fichier |
|-----|----------|---------|
| Public desktop `/` | PASS | `/tmp/portfolio-5-7-public-desktop-corrected.png` |
| Public mobile `/` | PASS | `/tmp/portfolio-5-7-public-mobile-corrected-wait.png` |
| Admin login | PASS | `/tmp/portfolio-5-7-admin-login.png` |

## Observations

- Premier passage public : les sections Services/Méthode étaient masquées quand le profil principal n'était pas publié. Correction appliquée : les sections Services/Méthode s'affichent désormais selon leur propre publication.
- Desktop corrigé : services et méthode visibles, cartes lisibles, ordre respecté, aucun chevauchement observé.
- Mobile corrigé : grille bascule en une colonne, textes lisibles, CTA contenus dans leurs cartes, aucun chevauchement observé dans la capture.

## Non exécuté

`VALIDATION VISUELLE NON EXÉCUTÉE`

Périmètre : admin Services/Méthode authentifié, formulaire création/modification, onglets FR/EN, bénéfices, livrables, technologies, compétences, publication, ordre et modales.

Cause : tentative CDP temporaire bloquée sans capture exploitable.

Éléments vérifiés statiquement : template PrimeNG, labels/`inputId`, absence de select natif, tests composants, lint, build.

Risque résiduel : un défaut visuel spécifique à l'état authentifié peut subsister. À couvrir par Playwright/axe avant release.
