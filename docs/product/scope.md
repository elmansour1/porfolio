# Périmètre (Scope)

## Statut

Validé en Phase 1 — Cadrage produit. Le découpage technique et les ADR restent en Phase 2.

## MVP

Mettre en ligne un portfolio professionnel réellement utilisable avec site public, administration sécurisée, contenu administrable français/anglais, formulaire de contact, SEO de base, responsive, accessibilité de base et qualité visuelle premium.

Le MVP doit rester un portfolio professionnel administrable, pas un CMS générique.

## Priorisation MVP

| Niveau | Fonctionnalités |
|--------|-----------------|
| MUST | Site public, profil, compétences, expériences, projets, services, contact, admin sécurisé, publication, FR/EN, médias principaux, SEO de base |
| SHOULD | Dashboard admin utile, prévisualisation simple, journal d'activité sensible minimal, gestion témoignages masquée si vide, indicateurs de crédibilité réels |
| COULD | Page `/projects` listant tous les projets si le volume le justifie, analytics simples, historique minimal des modifications |
| LATER | Blog, newsletter, multi-admin, rôles complexes, paiement, IA, synchronisations complètes, Kubernetes, microservices |

## Fonctionnalités incluses

- Site public : en-tête, Hero, À propos, compétences, expériences, projets, services, contact, pied de page.
- Pages publiques : `/`, `/projects/:slug`, `/privacy`, `/legal`, `/404`.
- Administration : connexion, tableau de bord, profil, sections principales, compétences, expériences, projets, services, coordonnées, réseaux, messages, médias principaux, SEO de base, paramètres essentiels.
- Publication : brouillon, publié, archivé selon les ressources pertinentes.
- Multilingue : français par défaut, anglais dans le MVP.
- Contact : formulaire validé, protection anti-spam, notification administrateur, stockage des messages.
- Médias : upload contrôlé, texte alternatif, optimisation, suppression sécurisée.
- Sécurité : routes admin protégées, validation backend, mots de passe hachés, limitation des tentatives, journalisation sensible.
- Documentation : lancement local, variables, structure, API, modèle de données, authentification, déploiement, sauvegarde, restauration, médias, création du premier administrateur.

## Exclusions du MVP

- Inscription publique.
- Plusieurs administrateurs et rôles complexes.
- Espace client ou recruteur.
- Blog complet.
- Newsletter.
- Commentaires.
- Paiement.
- Réservation de rendez-vous intégrée.
- IA conversationnelle ou génération automatique de contenu.
- Gestion avancée de versions.
- Workflow éditorial multi-validateur.
- Application mobile native.
- Microservices.
- Kubernetes.
- Multi-tenant.
- Marketplace.
- CRM.
- Synchronisation automatique complète LinkedIn/GitHub.
- Thème personnalisable par visiteur.
- Recherche avancée.
- Notifications push.

## Découpage fonctionnel recommandé pour Phase 4

1. Fondations publiques minimales et contenu administrable du profil.
2. Authentification admin et shell d'administration.
3. Gestion des contenus publiés : sections, compétences, expériences.
4. Gestion des projets et pages de détail.
5. Contact, messages, anti-spam minimal et notification.
6. Médias principaux et CV.
7. SEO, pages légales, polish responsive/accessibilité.

## Évolutions futures possibles

À analyser seulement après MVP ou GO explicite : page `/projects` complète, blog, analytics avancées, intégrations GitHub/LinkedIn, prise de rendez-vous, versions éditoriales avancées.

## Réserves acceptées

- Le MVP reste large pour un portfolio. Mitigation : découpage en vertical slices et interdiction d'anticiper les exclusions.
- L'administration du MVP est ambitieuse. Mitigation : `MUST` strict, `SHOULD` différable et aucune gestion multi-rôle.
- Les contenus réels conditionnent fortement la qualité perçue. Ils sont suivis dans `docs/product/content-preparation.md`.

## Dernière mise à jour

2026-07-21
