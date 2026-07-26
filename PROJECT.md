# PROJECT

## Nom

Portfolio professionnel de Faouzi El Mansour

## Nom technique

`faouzi-portfolio`

## Problème

Les informations professionnelles de Faouzi El Mansour peuvent être dispersées entre CV, LinkedIn, GitHub, plateformes d'emploi, documents PDF et messages privés. Cette dispersion réduit la capacité d'un recruteur, client ou partenaire à comprendre rapidement le profil, les compétences, l'expérience, les réalisations et les moyens de contact.

## Cible

- Recruteurs et responsables RH
- Responsables techniques
- Clients potentiels
- Entreprises et partenaires
- Réseau professionnel
- Moteurs de recherche
- Administrateur unique : Faouzi El Mansour

## Proposition de valeur

Un portfolio professionnel administrable, multilingue, rapide et sécurisé qui présente une identité professionnelle forte, démontre les compétences techniques avec des projets structurés, facilite la prise de contact et permet de maintenir le contenu sans modifier le code.

## Acteurs

Voir `docs/product/actors-and-roles.md`.

## MVP

Le MVP doit livrer :

- un site public premium avec landing page, sections profil, compétences, expériences, projets, services, contact, pages légales et détail projet ;
- un espace d'administration sécurisé avec un seul administrateur ;
- la gestion des contenus clés en français et anglais ;
- la publication/dépublication des contenus ;
- un formulaire de contact relié au backend et consultable dans l'administration ;
- les bases SEO, accessibilité, responsive, performance et sécurité.

## Exclusions

Inscription publique, multi-administrateurs, rôles complexes, blog complet, newsletter, paiement, réservation intégrée, IA conversationnelle, génération automatique de contenu, workflow éditorial avancé, application mobile native, microservices, Kubernetes, multi-tenant, marketplace, CRM, synchronisation complète LinkedIn/GitHub, thème visiteur personnalisable, recherche avancée, notifications push.

## Technologies

Stack validée par ADR pendant la Phase 2 :

| Couche | Technologie |
|--------|-------------|
| Frontend | Angular 20 ou version stable compatible, TypeScript strict, standalone, zoneless si compatible, SSR public, SCSS, Tailwind CSS, PrimeNG, ngx-translate |
| Backend | Java 21, Spring Boot 4 ou version stable compatible, Spring Security, Spring Data JPA, Bean Validation, API REST |
| Base de données | PostgreSQL avec migrations versionnées |
| Infrastructure | Docker, Docker Compose, variables d'environnement, health checks, logs structurés |

## Architecture

Architecture validée en Phase 2 : monolithe modulaire Spring Boot, frontend Angular public/admin, SSR pour les routes publiques dynamiques à enjeu SEO, admin CSR protégé, API REST `/api/v1`, PostgreSQL, stockage médias filesystem persistant, Docker Compose avec reverse proxy HTTPS.

## État

- Mode : Nouveau projet défini (Mode B)
- Phase courante : Aucune phase en cours
- Statut : `PHASE_CLÔTURÉE_EN_ATTENTE_DU_GO_HUMAIN`
- Code applicatif : Fondations techniques, authentification administrateur, layout/dashboard admin, profil professionnel, paramètres généraux, médias principaux et affichage public limité implémentés
- Framework IA : Installé
- Brief produit : Renseigné
- Dernière phase clôturée : Sous-phase 5.3 — Profil professionnel et paramètres généraux du portfolio

## Contraintes

- Budget limité, privilégier open source et offres gratuites adaptées.
- Marchés : Cameroun, Afrique francophone, Europe, international anglophone.
- Connexions potentiellement limitées : performance et poids média importants.
- Données personnelles : confidentialité, mentions légales, consentement formulaire, durée de conservation des messages.
- Sécurité admin, médias et messages prioritaire.
- Aucun contenu fictif trompeur.

## Risques

Voir `.agents/state/RISKS.md`.

Risques majeurs initiaux : scope trop large, contenu insuffisant, design générique, administration surdimensionnée, médias lourds, spam, sécurité admin, sur-ingénierie.

## Réserves de cadrage

- Hébergeur exact à choisir.
- Fournisseur e-mail exact à choisir.
- Seuils exacts session, rate limiting, upload, performance, sauvegarde à fixer.
- Durée de conservation des messages à fixer avant release.
- Contenus réels : à préparer avant mise en ligne.

## Décisions Phase 2

- Architecture globale : monolithe modulaire Spring Boot + Angular + PostgreSQL.
- Rendu public : Angular SSR pour routes publiques dynamiques, admin CSR.
- Authentification : session serveur Spring Security avec cookie sécurisé et CSRF.
- Publication/i18n : statuts simples et traductions publiables par langue.
- Médias : filesystem persistant MVP, metadata en base, whitelist stricte.
- Contact : stockage avant notification e-mail, honeypot et rate limiting.
- Déploiement : Docker Compose avec reverse proxy HTTPS.
- API : REST versionné `/api/v1`.
- Données : modèle relationnel par ressource portfolio.
- UX/UI : design system minimal premium.

## Décisions Phase 3

- La Phase 3 a été réalignée sur la conception UX/UI complète du portfolio, sans implémentation applicative.
- Les écrans publics validés en conception sont : landing, détail projet, contact, privacy, legal, 404 et liste projets différable.
- Les écrans admin validés en conception sont : login, dashboard, profil, projets, compétences, expériences, services, messages, médias, SEO, paramètres, journal d'activité et états accès refusé/session expirée.
- Le design system définit les tokens, composants, statuts, règles responsive et exigences accessibilité, mais les valeurs visuelles exactes seront finalisées dans le code.
- L'inspection visuelle réelle n'a pas été exécutée car aucune interface ou prototype n'existe et la Phase 3 excluait cette implémentation.

## Décisions Phase 5.1

- Le premier compte administrateur est créé au démarrage uniquement si aucun administrateur n'existe et si les variables `ADMIN_BOOTSTRAP_EMAIL` et `ADMIN_BOOTSTRAP_PASSWORD` sont fournies.
- L'administration utilise une session serveur Spring Security, des cookies sécurisés et la protection CSRF `XSRF-TOKEN` / `X-XSRF-TOKEN`.
- La limitation des tentatives de connexion est persistée côté backend.
- Les opérations sensibles d'authentification sont journalisées.
- La récupération de mot de passe utilise un jeton aléatoire hashé, à usage unique, expirant, non exposé en production.
- Les routes frontend d'authentification admin sont disponibles ; les routes admin protégées affichent un shell minimal sans gestion de contenu.
- Aucune fonctionnalité de gestion de contenu portfolio n'a été lancée.

## Décisions Phase 5.2

- L'administration utilise un shell unique avec sidebar, toolbar, menu compte, overlay mobile et zone de contenu par routes enfants.
- `/admin` redirige vers `/admin/dashboard`.
- Les menus des modules métier non implémentés sont visibles mais désactivés avec un état `À venir`.
- Le dashboard n'affiche aucune statistique fictive ; les compteurs restent `Indisponible` ou `À vérifier` tant que les API métier n'existent pas.
- Les raccourcis métier sont désactivés jusqu'aux sous-phases dédiées.
- La route demandée après expiration de session est conservée via `returnUrl` uniquement pour les chemins `/admin`.
- Un proxy frontend local permet l'inspection avec API Docker en développement.
- Aucun CRUD de contenu, profil, paramètres, médias, SEO ou messages n'a été lancé.

## Décisions Phase 5.3

- Le profil professionnel est un agrégat typé avec traductions FR/EN séparées des champs non traduisibles.
- Les paramètres généraux sont typés : identité du site, langues actives, email de réception, affichage global et visibilité des sections.
- Les médias principaux de cette sous-phase sont limités à photo, CV PDF, logo et favicon ; aucune médiathèque complète n'a été créée.
- Les API publiques exposent uniquement les données publiables et masquent les coordonnées si la visibilité n'est pas activée.
- Le rendu public `/` affiche seulement les données directement liées au profil/paramètres ; la landing complète reste hors périmètre.
- Les pages admin `/admin/profile` et `/admin/settings` sont livrées avec formulaires typés, états de chargement/erreur/succès, upload/remplacement/suppression contrôlée et responsive.
- Les CRUD compétences, expériences, formations, projets, services, messages, SEO avancé et sous-phase 5.4 n'ont pas été lancés.

## Commandes utiles

Backend :

```bash
cd backend
mvn test
mvn package
mvn spring-boot:run
```

Frontend avec Node 20+ :

```bash
cd frontend
npm install
npm run lint
npm run test:ci
npm run build
npm run serve:ssr
```

Environnement complet :

```bash
cp .env.example .env
docker compose config
docker compose up --build
```

## Liens utiles

- Brief : `PROJECT_BRIEF.md`
- Gouvernance : `AGENTS.md`
- Plan : `PLANS.md`
- État : `.agents/state/PROJECT_STATE.md`
- Handoff : `.agents/state/HANDOFF.md`
- Vision : `docs/product/vision.md`
- Scope : `docs/product/scope.md`
- Rapport Phase 1 : `.agents/state/PHASE_1_REPORT.md`
- Rapport Phase 2 : `.agents/state/PHASE_2_REPORT.md`
- Rapport Phase 3 : `.agents/state/PHASE_3_REPORT.md`
- Rapport Phase 4 : `.agents/state/PHASE_4_REPORT.md`
- Rapport Phase 5.1 : `.agents/state/PHASE_5_1_REPORT.md`
- Rapport Phase 5.2 : `.agents/state/PHASE_5_2_REPORT.md`
- Rapport Phase 5.3 : `.agents/state/PHASE_5_3_REPORT.md`

## Dernière mise à jour

2026-07-22
