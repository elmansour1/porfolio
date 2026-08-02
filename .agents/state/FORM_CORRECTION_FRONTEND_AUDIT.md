# Audit frontend — Correction formulaires admin

Date : 2026-08-02

## Périmètre audité

- `frontend/src/app/admin/auth/pages/*`
- `frontend/src/app/admin/profile/pages/profile.page.ts`
- `frontend/src/app/admin/profile/pages/settings.page.ts`
- `frontend/src/app/admin/skills/pages/skills.page.ts`
- `frontend/src/app/admin/career/pages/career.page.ts`
- `frontend/src/styles.scss`

## Vérifications

| Contrôle | Résultat |
|----------|----------|
| Formulaires réactifs typés conservés | PASS |
| DTO/API non modifiés | PASS |
| Backend non modifié | PASS |
| Scan `<select>/<option>` admin | PASS |
| Scan `type="checkbox"` et `type="file"` templates admin | PASS |
| PrimeNG pour inputs, selects, dates, uploads, toggles et actions | PASS |
| `npm run lint` | PASS |
| Tests Angular ChromeHeadless | PASS — 29 tests |
| Build Angular Node 20 | PASS avec warning budget initial +16,84 kB |

## Constats

- Les formulaires restent organisés par feature et conservent les modèles de formulaires typés existants.
- Les champs interactifs natifs ont été remplacés par PrimeNG dans les templates admin.
- Les modales Compétences et Parcours protègent l'abandon de modifications par comparaison de snapshot du formulaire.
- Les tests profil/paramètres ont été ajustés avec `provideHttpClient` car `p-fileupload` injecte `HttpClient`.

## Réserves acceptées et tracées

- Node local `18.19.1` reste incompatible Angular 20 ; commandes Angular exécutées avec Node 20 temporaire via `npx`.
- Le build passe avec un warning de budget initial `516.84 kB` pour un seuil `500.00 kB`.
- Aucun harnais E2E permanent n'est installé ; inspection réelle effectuée par script CDP temporaire.

## Verdict

Frontend Reviewer Verdict : `CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`
