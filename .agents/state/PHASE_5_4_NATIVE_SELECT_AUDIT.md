# Audit des composants de sélection — Sous-phase 5.4

## Périmètre

Sous-phase 5.4 : administration des catégories de compétences et des compétences, section publique compétences.

## Inventaire 5.4

Commande exécutée :

```bash
grep -R "<select\|<option" -n frontend/src/app/admin/skills frontend/src/app/public
```

Résultat : aucun `<select>` ni `<option>` natif détecté dans le périmètre 5.4.

## Sélections implémentées

| Fichier | Composant | Champ | Usage | Composant PrimeNG | Risque |
|---------|-----------|-------|-------|-------------------|--------|
| `frontend/src/app/admin/skills/skills.page.ts` | `SkillsPage` | Filtre catégorie | Filtrer les compétences admin | `p-select` | Faible |
| `frontend/src/app/admin/skills/skills.page.ts` | `SkillsPage` | Filtre statut catégorie | Filtrer les catégories | `p-select` | Faible |
| `frontend/src/app/admin/skills/skills.page.ts` | `SkillsPage` | Filtre statut compétence | Filtrer les compétences | `p-select` | Faible |
| `frontend/src/app/admin/skills/skills.page.ts` | `SkillsPage` | Filtre mise en avant | Filtrer les compétences principales | `p-select` | Faible |
| `frontend/src/app/admin/skills/skills.page.ts` | `SkillsPage` | Catégorie du formulaire compétence | Rattacher une compétence à une catégorie | `p-select` | Moyen si aucune catégorie publiée |
| `frontend/src/app/admin/skills/skills.page.ts` | `SkillsPage` | Niveau qualitatif | Sélectionner le niveau sans pourcentage | `p-select` | Faible |
| `frontend/src/app/admin/skills/skills.page.ts` | `SkillsPage` | Statut éditorial | Brouillon/publié/archivé | `p-select` | Faible |
| `frontend/src/app/admin/skills/skills.page.ts` | `SkillsPage` | Mise en avant | Booléen métier | `p-toggleswitch` | Faible |
| `frontend/src/app/admin/skills/skills.page.ts` | `SkillsPage` | Visibilité publique | Booléen métier | `p-checkbox` | Faible |

## Hors périmètre détecté

Une recherche globale frontend montre encore des sélecteurs natifs dans :

- `frontend/src/app/admin/profile/profile.page.ts`
- `frontend/src/app/admin/profile/settings.page.ts`

Ces fichiers appartenaient à la sous-phase 5.3. Ils n'ont pas été modifiés pendant 5.4 pour éviter un changement hors périmètre. Dette tracée puis résolue par correctif qualité post-clôture du 2026-07-26 : `TD-006`.

## Verdict

`CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`

Réserve résolue le 2026-07-26 : les sélecteurs natifs hors périmètre 5.4 ont été remplacés par `p-select` pendant le correctif qualité puis confirmés par scan global `frontend/src/app`.
