# Audit frontend — Sous-phase 5.8

## Verdict

`CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`

## Points conformes

- Architecture par feature `public/home`.
- Composants de présentation sans HTTP direct.
- Data-access centralisé, erreurs partielles et visibilité de sections.
- Types explicites pour langue, sections, erreurs et copy UI.
- Tests de régression pour Hero désactivé, Contact désactivé, sous-sections parcours, erreurs partielles et changement de langue.
- Route racine en SSR dynamique.

## Corrections après revue

- Hero masqué quand `HERO.visible=false`.
- Parcours découplé entre expériences et formations/certifications.
- CTA Contact conditionnels dans header, footer, hero et services.
- Fallback Hero vers `/projects` au lieu de `#projects`.
- Lien admin retiré du footer public.

## Réserves

- Créer des services API publics dédiés pour supprimer le couplage aux services `admin/**`.
- Budget initial Angular au-dessus du seuil.

