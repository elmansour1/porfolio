# Handoff UX vers Frontend

## Statut

Validé en Phase 3 — Conception UX/UI du portfolio.

## Objectif

Préparer l'implémentation frontend sans créer de code pendant cette phase.

## Documents UX à lire avant implémentation

1. `docs/ux/information-architecture.md`
2. `docs/ux/public-screens.md`
3. `docs/ux/admin-screens.md`
4. `docs/ux/wireframes.md`
5. `docs/ux/design-system.md`
6. `docs/ux/state-model.md`
7. `docs/ux/responsive-accessibility.md`
8. `docs/ux/screen-validation-matrix.md`
9. `docs/ux/validation-process.md`

## Routes publiques

| Route | Page Angular cible | Rendu |
|-------|--------------------|-------|
| `/` | `public/home` | SSR |
| `/projects/:slug` | `public/project-detail` | SSR |
| `/privacy` | `public/legal/privacy` | Prérendu possible |
| `/legal` | `public/legal/legal` | Prérendu possible |
| `/404` | `public/not-found` | SSR/CSR |

## Routes admin

| Route | Page Angular cible |
|-------|--------------------|
| `/admin/login` | `admin/auth/login` |
| `/admin` | redirection vers `admin/dashboard` |
| `/admin/dashboard` | `admin/dashboard` |
| `/admin/profile` | `admin/profile` |
| `/admin/projects` | `admin/projects/list` |
| `/admin/projects/:id` | `admin/projects/editor` |
| `/admin/skills` | `admin/skills` |
| `/admin/experiences` | `admin/experience` |
| `/admin/services` | `admin/services` |
| `/admin/messages` | `admin/messages` |
| `/admin/media` | `admin/media` |
| `/admin/seo` | `admin/seo` |
| `/admin/settings` | `admin/settings` |
| `/admin/activity` | `admin/activity-log` |

## Composants publics attendus

- `PublicHeader`
- `LanguageSwitcher`
- `HeroSection`
- `CredibilityStrip`
- `AboutSection`
- `SkillCategoryList`
- `FeaturedProjects`
- `ProjectCard`
- `ExperienceTimeline`
- `ServicesSection`
- `WorkMethodSection`
- `ContactForm`
- `PublicFooter`
- `ProjectCaseStudy`
- `LegalPage`
- `NotFoundPage`

## Composants admin attendus

- `AdminShell`
- `AdminSidebar` — implémenté dans le shell 5.2
- `AdminTopbar` — implémenté dans le shell 5.2
- `StatusBadge`
- `TranslationStatus`
- `ContentToolbar`
- `ConfirmDialog`
- `UnsavedChangesPrompt`
- `MediaUploader`
- `MediaUsageList`
- `SeoFields`
- `PublicationControls`
- `AdminDataTable`
- `EmptyState`
- `ErrorState`
- `LoadingState`

## Implémenté en sous-phase 5.2

- Shell admin unique avec sidebar, toolbar, menu compte, déconnexion, skip link, overlay mobile et `router-outlet`.
- Dashboard avec métriques indisponibles explicites, raccourcis désactivés et état vide d'activité.
- Page 404 admin interne au shell.
- Conservation sécurisée de la route admin demandée après reconnexion via `returnUrl`.
- Proxy local `frontend/proxy.conf.json` pour vérifier l'authentification réelle en développement.

Les modules profil, projets, compétences, expériences, services, messages, médias, SEO et paramètres restent désactivés jusqu'à GO dédié.

## PrimeNG / Tailwind / SCSS

- PrimeNG : tables admin, dialogs, menus, dropdowns, confirmations, file upload si compatible avec règles sécurité.
- Tailwind : layout, grilles, espacements, responsive.
- SCSS : tokens, thème, ajustements spécifiques, animations.

## Données UI sensibles

- Ne jamais afficher messages, logs, brouillons ou médias privés dans le public.
- Ne jamais afficher secrets ou détails techniques.
- Les projets confidentiels doivent porter un indicateur admin clair.

## Critères avant implémentation

- Design tokens créés.
- Routes validées.
- États d'interface codifiables.
- Breakpoints définis.
- Composants publics/admin priorisés.
- Textes réels ou placeholders explicitement marqués.

## Contrôles obligatoires pendant l'implémentation

- Ne pas publier de statistiques, témoignages, certifications, clients ou résultats fictifs.
- Prévoir une stratégie explicite lorsqu'une traduction FR/EN manque.
- Garder le site public compatible SSR selon `ADR-0002`.
- Ne pas accéder directement aux APIs dans les composants de présentation.
- Prévoir les états chargement, vide, erreur, succès et accès refusé selon `docs/ux/state-model.md`.
- Vérifier le responsive sur mobile, tablette, laptop et grand écran.
- Exécuter une inspection visuelle réelle avant toute clôture frontend.
- Appliquer le gate frontend senior et le gate UX/UI premium.

## Réserves transmises au frontend

- Les valeurs exactes des tokens visuels doivent être finalisées dans le code puis inspectées.
- Le rendu SaaS premium reste une exigence à valider sur écran réel.
- Les contenus finaux FR/EN, médias, CV et textes légaux doivent être fournis ou explicitement marqués comme manquants.
- Les choix hébergeur, e-mail, tailles médias et durées de conservation restent à confirmer hors UX.

## Dernière mise à jour

2026-07-22
