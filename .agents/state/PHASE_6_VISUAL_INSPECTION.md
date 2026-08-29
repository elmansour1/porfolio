# Inspection visuelle — Phase 6

## Périmètre

Surfaces publiques servies par `ng serve` (`http://127.0.0.1:4200/`) le 2026-08-29.

Backend local non démarré : PostgreSQL écoute sur `:5432` mais refuse l'utilisateur `portfolio`. La landing a donc été inspectée en **état d'échec de chargement du portfolio**, pas avec un profil publié.

## Résultats

| Surface | Viewport | Observation | Statut |
|---------|----------|-------------|--------|
| `/` état erreur API | Desktop | Skip-link, header, i18n FR/EN, message « Portfolio en cours de préparation », footer légal | PASS |
| `/` CTA Contact | Desktop puis mobile | Lien `#contact` présent alors que le formulaire n'existe pas | CORRIGÉ |
| `/` header mobile | 390×844 | Menu hamburger, skip-link, footer sans Contact mort | PASS |
| `/privacy` | Desktop | Titre, sections, skip-link, i18n, réserves éditeur visibles | PASS avec réserve contenu |
| `/legal` | Desktop | Placeholders éditeur, bandeau de réserve, navigation | PASS avec réserve contenu |
| `/404` | Desktop | Titre, CTAs accueil/projets/contact, i18n | PASS |
| Formulaire contact vivant | — | Non inspecté (API indisponible) | NON EXÉCUTÉ |
| `/admin/messages` | — | Non inspecté (auth) | NON EXÉCUTÉ |

## Accessibilité constatée

- Skip-link « Aller au contenu principal » présent sur landing et pages légales.
- Boutons langue avec état `pressed` / `released`.
- Menu mobile `Ouvrir le menu` en viewport étroit.
- `prefers-reduced-motion` déjà présent dans `styles.scss` (non rejoué runtime).

## Limites

Pas d'audit Lighthouse, axe ou clavier exhaustif. Pas de contenu réel publié.

## Dernière mise à jour

2026-08-29
