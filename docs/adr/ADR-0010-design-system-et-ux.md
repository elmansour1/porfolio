# ADR-0010 — Design system et UX/UI

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le produit doit avoir un site public premium et une administration professionnelle.

## Problème

Sans direction UI explicite, le portfolio peut ressembler à un template générique ou l'admin à un CRUD brut.

## Contraintes

- Identité visuelle finale à produire en Phase 3/4.
- Tailwind, PrimeNG, SCSS.
- Accessibilité et responsive obligatoires.

## Options considérées

- Template admin générique.
- Design system minimal propre au portfolio.
- Design system lourd.

## Décision

Définir un design system minimal mais cohérent : tokens couleur/typo/espacement/rayons/ombres, composants publics, composants admin, états et règles responsive/accessibilité.

## Justification

Un système minimal évite la dispersion visuelle sans bloquer le MVP par un design system trop lourd.

## Conséquences positives

- Cohérence public/admin.
- Meilleure qualité perçue.
- Base claire pour frontend Phase 3.

## Conséquences négatives

- Nécessite inspection visuelle réelle pendant l'implémentation.

## Risques

- Contenus réels insuffisants.
- Surdesign non proportionné.

## Impacts sécurité

États d'erreur et accès refusé doivent éviter les détails sensibles.

## Impacts données

Les textes et médias nécessaires sont suivis dans `docs/product/content-preparation.md`.

## Migration

Sous-phase 5.4 :

- les sélections du module compétences utilisent les composants PrimeNG (`p-select`, `p-toggleswitch`, `p-checkbox`) ;
- les tableaux admin utilisent `p-table` ;
- les statuts utilisent `p-tag` ;
- les formulaires larges sont affichés en `p-dialog` centré ;
- aucun `<select>` natif n'est présent dans le périmètre compétences.

Les sélecteurs natifs encore présents dans profil/paramètres appartiennent à la sous-phase 5.3 et sont tracés comme dette technique.

## Rollback

Refonte visuelle majeure nécessiterait décision UX ultérieure.

## ADR remplacé ou lié

Lié : ADR-0002.
