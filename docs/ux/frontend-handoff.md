# Handoff UX vers Frontend

## Statut

Validé en Phase 3 — Conception UX/UI du portfolio. Mis à jour après correction transversale des formulaires admin du 2026-08-02.

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

Les modules projets, expériences, services, messages, médias et SEO restent désactivés jusqu'à GO dédié. Profil, paramètres et compétences sont activés selon leurs sous-phases.

## Implémenté en sous-phase 5.4

- Route `/admin/skills` active.
- Administration des catégories et compétences dans une page dédiée.
- Sélections avec PrimeNG uniquement dans le périmètre 5.4.
- API typée centralisée dans `admin/skills/skills-api.service.ts`.
- Section publique compétences alimentée par API.

Réserve levée pour les formulaires existants le 2026-08-02 via inspection Chrome headless DevTools avec mock API local.

## Correction formulaires admin 2026-08-02

- Pages concernées : auth admin, profil, paramètres, compétences/catégories, expériences/formations/certifications.
- Règle de champ : label au-dessus, contrôle pleine largeur, message proche du champ.
- Règle de grille : une colonne mobile, deux colonnes desktop, pleine largeur pour textes longs, médias, listes et contenus traduits.
- Règle multilingue : `p-tabs` FR/EN, un seul contenu long visible à la fois.
- Règle booléens : `p-toggleswitch` pour les options principales ; éviter les Oui/Non en select.
- Règle modales : `p-dialog` centré, corps scrollable, footer sticky, confirmation d'abandon lorsque le formulaire a changé.
- Règle composants : pas de `<select>`, `<option>`, checkbox native ou file input natif dans les templates admin ; utiliser PrimeNG.

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
- Ne pas créer de `<select>`, `<option>`, checkbox native ou input file natif dans les nouveaux formulaires ; utiliser les composants PrimeNG retenus.
- Prévoir les états chargement, vide, erreur, succès et accès refusé selon `docs/ux/state-model.md`.
- Vérifier le responsive sur mobile, tablette, laptop et grand écran.
- Exécuter une inspection visuelle réelle avant toute clôture frontend.
- Appliquer le gate frontend senior et le gate UX/UI premium.

## Réserves transmises au frontend

- Les valeurs exactes des tokens visuels doivent être finalisées dans le code puis inspectées.
- Le rendu SaaS premium reste une exigence à valider sur écran réel.
- Les contenus finaux FR/EN, médias, CV et textes légaux doivent être fournis ou explicitement marqués comme manquants.
- Les choix hébergeur, e-mail, tailles médias et durées de conservation restent à confirmer hors UX.
- Aucun sélecteur natif hérité ne reste dans les templates admin après la correction 2026-08-02.

## Dernière mise à jour

2026-08-02
