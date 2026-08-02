# Audit UX/UI — Correction formulaires admin

Date : 2026-08-02

## Inspection visuelle exécutée

Runtime :

- Angular dev server local `http://127.0.0.1:4200`
- mock API temporaire `http://127.0.0.1:8080`
- Chrome headless DevTools

Captures :

- `/tmp/portfolio-form-inspection/admin-login.png`
- `/tmp/portfolio-form-inspection/admin-forgot-password.png`
- `/tmp/portfolio-form-inspection/admin-reset-password-token-test-token.png`
- `/tmp/portfolio-form-inspection/admin-profile-desktop-after-grid-fix.png`
- `/tmp/portfolio-form-inspection/admin-profile-mobile.png`
- `/tmp/portfolio-form-inspection/admin-settings-desktop.png`
- `/tmp/portfolio-form-inspection/admin-skills-list.png`
- `/tmp/portfolio-form-inspection/admin-skills-category-dialog.png`
- `/tmp/portfolio-form-inspection/admin-skills-category-dialog-en.png`
- `/tmp/portfolio-form-inspection/admin-skills-category-select-open.png`
- `/tmp/portfolio-form-inspection/admin-career-list.png`
- `/tmp/portfolio-form-inspection/admin-career-experience-dialog.png`
- `/tmp/portfolio-form-inspection/admin-career-datepicker-open.png`
- `/tmp/portfolio-form-inspection/admin-career-mobile-dialog.png`

## Non-conformités initiales corrigées

- Profil desktop : chevauchement du panneau latéral sur la colonne de contenu.
- Onglets FR/EN : panneaux inactifs affichés à cause d'une règle CSS qui surchargeait `hidden`.
- Modales longues : contenu peu structuré et actions dépendantes du scroll.
- Booléens : composants hétérogènes selon les pages.
- Uploads : inputs fichier natifs remplacés par `p-fileupload`.

## Contrôles UX/UI

| Critère | Résultat |
|---------|----------|
| Labels au-dessus | PASS |
| Alignement des champs | PASS |
| Largeurs cohérentes | PASS |
| Grille responsive | PASS |
| Onglets multilingues | PASS |
| Modales centrées et scrollables | PASS |
| Footer d'actions visible | PASS |
| Booléens cohérents | PASS |
| Datepicker PrimeNG | PASS |
| Absence de débordement horizontal desktop/mobile | PASS |
| Accessibilité statique labels/focus/ordre | PASS |

## Réserves acceptées et tracées

- La navigation clavier exhaustive et l'audit axe automatisé restent à installer avant release.
- Les contrôles natifs internes à PrimeNG (`input[type=file]`, inputs cachés de switch) existent dans le DOM runtime mais ne sont pas des composants natifs codés dans les templates.

## Verdict

UX/UI Reviewer Verdict : `CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`
