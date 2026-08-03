# Audit accessibilité — Sous-phase 5.8

## Verdict

`CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`

## Vérifications

- Skip link vers `#main-content`.
- Landmarks `header`, `nav`, `main`, `section`, `footer`.
- Bouton menu mobile avec `aria-expanded` et `aria-controls`.
- Langue avec `aria-pressed`.
- Labels ARIA FR/EN dans `HOME_COPY`.
- Focus visible global.
- Navigation clavier testée via CDP : skip link, marque, menu, CTA, cartes.
- `prefers-reduced-motion` couvert par CSS.

## Réserve

Aucun outil axe/Playwright n'est installé ; l'audit accessibilité reste une combinaison de revue code, tests Angular et inspection Chrome headless.

