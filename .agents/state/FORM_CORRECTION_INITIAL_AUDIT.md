# Audit initial — Correction UX/UI et structurelle des formulaires

## Statut

Intervention autorisée par GO utilisateur du 2026-08-02.

## Périmètre réellement implémenté

Les formulaires existants dans `frontend/src/app/admin` sont :

| Fichier | Fonctionnalité | Type | Structure actuelle | Défauts | Priorité |
|---------|----------------|------|--------------------|---------|----------|
| `auth/pages/login.page.ts` | Connexion | Page | Formulaire court, labels au-dessus, champs pleine largeur | Rendu acceptable, pas de PrimeNG input, mais hors CRUD métier et sans défaut observé critique | MINEUR |
| `auth/pages/forgot-password.page.ts` | Mot de passe oublié | Page | Formulaire court, labels au-dessus | Rendu acceptable, pas de composant PrimeNG, faible risque UX | MINEUR |
| `auth/pages/reset-password.page.ts` | Reset mot de passe | Page | Formulaire court, labels au-dessus | Rendu acceptable, pas de composant PrimeNG, faible risque UX | MINEUR |
| `profile/pages/profile.page.ts` | Profil professionnel | Page avec aside | Grille principale + aside, labels au-dessus, FR/EN en deux colonnes, listes dynamiques | FR/EN comprimés, checkbox natives, file inputs natifs, champs sans PrimeNG, listes dynamiques serrées, erreurs peu visibles | MAJEUR |
| `profile/pages/settings.page.ts` | Paramètres généraux | Page avec aside | Grille principale + aside | Checkbox natives, file inputs natifs, champs sans PrimeNG, sections visibles avec contrôles peu alignés | MAJEUR |
| `skills/pages/skills.page.ts` | Catégories et compétences | Modales + filtres | Modales PrimeNG, grille deux colonnes, FR/EN en deux fieldsets côte à côte | FR/EN comprimés dans des colonnes étroites, footer d'action non sticky, booléen visible en checkbox isolée | MAJEUR |
| `career/pages/career.page.ts` | Expériences, formations, certifications | Trois formulaires longs en modale | Une modale large, champs en grille, FR/EN côte à côte | Formulaires trop longs, FR/EN comprimés, footer non sticky, sections insuffisantes, checkbox confidentiel incohérente, messages d'erreur génériques | CRITIQUE |

## Composants natifs détectés

- Aucun `<select>` ou `<option>` natif détecté.
- Inputs texte natifs avec `pInputText` parfois absent dans profil/paramètres.
- Checkboxes natives dans profil/paramètres.
- Inputs file natifs dans profil/paramètres.

## Structure cible

- Labels au-dessus des contrôles.
- Contrôles pleine largeur via classes globales et `[fluid]` lorsque pertinent.
- Grilles `1 colonne mobile`, `2 colonnes desktop`.
- Champs longs en pleine largeur.
- `p-tabs` pour contenus traduits FR/EN.
- `p-toggleswitch` pour booléens de visibilité, publication et options principales.
- `p-fileupload` basic/custom pour les uploads profil, CV, logo et favicon.
- Modales longues avec largeur responsive, corps scrollable et footer d'actions sticky.

## Verdict initial

`NON CONFORME` sur le périmètre formulaires longs et médias.

Correction requise avant clôture.
