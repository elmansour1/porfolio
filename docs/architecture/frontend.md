# Architecture frontend

## Statut

Validé en Phase 2 — Architecture et conception. Fondation Angular implémentée en Phase 4, authentification admin en sous-phase 5.1, layout et dashboard admin en sous-phase 5.2, profil/paramètres en 5.3, compétences/catégories en 5.4, parcours en 5.5 et correction formulaires admin le 2026-08-02.

## Stack

- Angular 20 ou version stable compatible.
- TypeScript strict.
- Composants standalone.
- Zoneless lorsque compatible avec les dépendances retenues.
- Angular SSR pour les routes publiques dynamiques à enjeu SEO ; prérendu possible pour pages statiques.
- SCSS, Tailwind CSS, PrimeNG, ngx-translate.
- Formulaires réactifs typés.

## Structure cible

```text
frontend/
  src/app/
    core/
    shared/
    public/
      home/
      project-detail/
      legal/
    admin/
      shell/
      dashboard/
      profile/
        api/
        mappers/
        models/
          dto/
          forms/
        pages/
      skills/
        api/
        mappers/
        models/
          dto/
          forms/
        pages/
      experience/
      projects/
      services/
      messages/
      media/
      seo/
      settings/
    api/
```

## Structure implémentée en Phase 4

```text
frontend/
  src/app/
    app.config.ts
    app.routes.ts
    public/
      public-placeholder.page.ts
    admin/
      auth/
      shell/
      dashboard/
      shared/
  public/i18n/
  tailwind.config.js
  eslint.config.js
```

La sous-phase 5.1 ajoute uniquement les écrans et services d'authentification admin.

La sous-phase 5.2 ajoute :

- shell admin unique avec sidebar, toolbar, zone de contenu et `router-outlet` ;
- route enfant `/admin/dashboard` ;
- page 404 interne à l'administration ;
- dashboard avec états indisponibles explicites, sans statistiques fictives ;
- composants structurels limités : métrique, action rapide, badge de statut, état vide ;
- proxy local frontend `proxy.conf.json` pour vérifier l'auth admin via API en développement.

Les composants métier de gestion du contenu restent exclus.

La sous-phase 5.4 ajoute :

- route enfant `/admin/skills` ;
- feature `admin/skills` avec page, modèles, service API typé et tests ;
- intégration PrimeNG globale via `providePrimeNG` et preset Aura ;
- section publique compétences alimentée par `/api/v1/public/skills` ;
- conformité stricte des sélections 5.4 avec `p-select`, `p-toggleswitch` et `p-checkbox`.

La correction formulaires du 2026-08-02 consolide les conventions UI admin existantes sans nouvelle fonctionnalité :

- classes SCSS transverses `admin-form-grid`, `admin-form-section`, `admin-language-tabs`, `admin-toggle-row`, `admin-dialog-actions` ;
- contrôles PrimeNG pleine largeur avec `min-width: 0` pour éviter les débordements ;
- `p-tabs` pour contenus FR/EN ;
- `p-fileupload` pour les uploads profil/paramètres ;
- snapshot de formulaire dans les modales compétences/parcours pour confirmer l'abandon de modifications.

## Principes

- Organisation par fonctionnalité.
- Lazy loading des routes admin et des pages publiques secondaires.
- Composants page pour orchestration et composants présentation pour rendu.
- Appels HTTP centralisés dans clients API typés.
- État local par feature avec Signals/RxJS selon complexité.
- Aucun `any` non justifié.
- Textes utilisateur traduisibles.
- Guards admin pour UX, mais sécurité réelle côté backend.

## Public vs admin

| Zone | Rendu | Priorité |
|------|-------|----------|
| Public `/`, `/projects/:slug`, `/privacy`, `/legal` | SSR/prérendu selon route | SEO, performance, accessibilité |
| Admin `/admin/**` | CSR derrière auth | Productivité, formulaires, états, sécurité UX |

## Authentification admin Phase 5.1

Routes :

- `/admin/login`
- `/admin/forgot-password`
- `/admin/reset-password`
- `/admin/session-expired`
- `/admin/forbidden`
- `/admin` protégé par guard et redirigé vers `/admin/dashboard`
- `/admin/dashboard`
- `/admin/**` inconnu : page admin introuvable dans le shell

Le frontend ne stocke aucun token dans `localStorage`. La session est portée par cookie serveur `HttpOnly`; le CSRF est géré via cookie `XSRF-TOKEN` et header Angular `X-XSRF-TOKEN`.

Depuis la sous-phase 5.2, le guard transmet `returnUrl` au login pour revenir à la route admin demandée lorsque celle-ci commence par `/admin`. Le login refuse les destinations non admin ou la route login elle-même et revient alors à `/admin/dashboard`.

## Vérifications Phase 4

- `npm run lint` : PASS.
- `npm run test:ci` : PASS, 4 tests Chrome Headless.
- `npm run build` : PASS.
- Inspection visuelle fondation `/` desktop et `/admin` mobile : PASS.
- Réserve : `npm audit` signale 3 vulnérabilités modérées dans la chaîne de dépendances de développement Angular CLI ; correction différée car Angular CLI 21 serait nécessaire.

## Vérifications Phase 5.1

- `npm run lint` : PASS.
- `npm run test:ci` : PASS, 9 tests Chrome Headless.
- `npm run build` : PASS.
- Correction appliquée : prérendu désactivé pour `/admin/**` afin d'éviter les appels auth pendant le build.

## Vérifications Phase 5.2

- `npm run lint` : PASS.
- `npm run test:ci` : PASS, 17 tests Chrome Headless.
- `npm run build` : PASS.
- `mvn package` backend : PASS, 12 tests, pour vérifier la non-régression auth.
- `npm audit --audit-level=moderate` : FAIL, 3 vulnérabilités modérées dans le tooling Angular CLI.
- Inspection visuelle réelle : PASS avec correction responsive tablette et état désactivé des actions rapides.

Captures réalisées :

- dashboard desktop 1440 ;
- dashboard laptop 1366 ;
- dashboard tablette 768 ;
- dashboard mobile 390 ;
- menu mobile ;
- page admin 404 ;
- page 403 ;
- session expirée.

## Vérifications Phase 5.4

- `npm run lint` avec Node 20 temporaire : PASS.
- `npm run test:ci` avec Node 20 temporaire : PASS, 24 tests Chrome Headless.
- `npm run build` avec Node 20 temporaire : PASS avec warning budget initial +2,94 kB.
- Audit `<select>/<option>` sur `admin/skills` et ajouts publics : PASS.
- Inspection visuelle réelle : NOT EXECUTED, runtime complet indisponible.

## Correctif qualité frontend 2026-07-26

- Les `<select>/<option>` natifs restants dans `admin/profile` et `admin/settings` ont été remplacés par `p-select`.
- Les features `admin/profile` et `admin/skills` sont structurées en `api/`, `models/dto/` et `pages/`, alignées sur la séparation déjà appliquée à `admin/auth`.
- Les contrats utilisés par les services API frontend doivent être placés dans `models/dto/`, pas directement dans les services.
- Scan `frontend/src/app` : aucun `<select>`, `<option>` ou `HTMLSelectElement` restant.
- `npm run lint`, `npm run test:ci` et `npm run build` passent avec Node 20 temporaire.

## Correction formulaires admin 2026-08-02

- Auth admin : inputs et actions convertis aux composants PrimeNG (`pInputText`, `p-button`) tout en conservant les formulaires réactifs existants.
- Profil/Paramètres : labels au-dessus, selects PrimeNG, toggles cohérents, upload média via `p-fileupload`, grilles et aside corrigés.
- Compétences/Catégories : formulaires modaux structurés en sections, contenus FR/EN en `p-tabs`, footer sticky, confirmation d'abandon.
- Parcours : formulaires expériences/formations/certifications structurés en sections, `p-select`, `p-multiselect`, `p-datepicker`, `p-inputnumber`, `p-toggleswitch`, `p-tabs`.
- Scan templates admin : PASS, aucun `<select>`, `<option>`, `input[type="checkbox"]` ou `input[type="file"]` natif ajouté ou conservé.
- Vérifications : `npm run lint` PASS ; tests Angular PASS — 29 tests ; build PASS avec warning budget initial +16,84 kB.
- Inspection visuelle : PASS via Angular dev server, mock API local et Chrome headless DevTools ; captures dans `/tmp/portfolio-form-inspection`.

## Restructuration architecturale exceptionnelle 2026-07-26

- DTO auth déplacés dans `admin/auth/models/dto`.
- Types de formulaires extraits dans `admin/profile/models/forms` et `admin/skills/models/forms`.
- Mappers frontend créés dans `admin/profile/mappers` et `admin/skills/mappers`.
- Type générique `SelectOption` déplacé dans `src/app/shared/models`.
- Composants UI admin partagés déplacés dans `admin/shared/ui`.
- Les services API restent les seuls détenteurs de `HttpClient` dans les features admin.
- Les pages n'hébergent plus les conversions payload principales des domaines profile/settings/skills.

Vérifications :

- `npm run lint` avec Node 20 temporaire : PASS.
- `npm run test:ci` avec Node 20 temporaire : PASS, 24 tests Chrome Headless.
- `npm run build` avec Node 20 temporaire : PASS avec warning budget initial +2,93 kB.
- Scan `frontend/src/app` : PASS, aucun `<select>`, `<option>`, `HTMLSelectElement` ou `any`.

## États obligatoires

- Chargement.
- Contenu.
- Vide.
- Erreur.
- Succès.
- Accès refusé.
- Action en cours.
- Brouillon / publié / archivé.
- Traduction manquante.

## Dernière mise à jour

2026-08-02
