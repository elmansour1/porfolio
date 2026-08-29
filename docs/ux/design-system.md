# Design System — Site public premium

## Statut

Validé — recadrage premium 2026-08-29.

## Direction visuelle

Inspirée Linear / Stripe : **clarté, densité maîtrisée, une accent color**, surfaces en profondeur. Hero sombre contrasté ; sections contenu sur fond clair.

## Tokens publics (landing)

| Token | Valeur | Usage |
|-------|--------|-------|
| `--home-ink` | `#0b0f17` | Texte hero, titres |
| `--home-ink-muted` | `#4b5563` | Corps de texte |
| `--home-surface` | `#f7f8f5` | Fond page |
| `--home-surface-muted` | `#eef2f0` | Bandes alternées |
| `--home-surface-card` | `#ffffff` | Cartes |
| `--home-accent` | `#5e6ad2` | CTA, liens, accent Linear-like |
| `--home-accent-teal` | `#0f766e` | Secondaire (legacy admin aligné) |
| `--home-hero-gradient` | mesh violet/teal | Fond hero |
| `--home-radius` | `0.75rem` | Cartes premium |
| `--home-shadow` | `0 24px 48px rgb(11 15 23 / 8%)` | Élévation |

## Typographie

- **Display** : Inter 700–800, letter-spacing serré sur h1 (max ~11ch)
- **Eyebrow** : 0.82rem, uppercase, weight 800, accent
- **Corps** : 1.04–1.08rem, line-height 1.75
- **Mono** (stack) : ui-monospace pour bandeau compétences clés

## Composants landing

| Composant | Rôle |
|-----------|------|
| `home-hero-band` | Bande full-width sombre + mesh |
| `home-core-stack` | Bandeau stack principale |
| `home-skills-bento` | Grille 2–3 col. catégories |
| `home-skill-level` | Barre de maîtrise 4 niveaux |
| `home-project-grid` | Cartes études de cas 2 col. |
| `home-button--primary` | CTA accent rempli |

## Répartition Tailwind / SCSS / PrimeNG

- **SCSS** : tokens, hero, landing, animations
- **Tailwind** : utilitaires admin et grilles ponctuelles
- **PrimeNG** : admin uniquement sur le périmètre actuel

## Accessibilité

- Contraste AA minimum sur hero et boutons
- Focus visible `--shadow-focus`
- Labels associés, sections `aria-labelledby`
- `prefers-reduced-motion` respecté sur animations hero

## Dernière mise à jour

2026-08-29
