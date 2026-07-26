# ADR-0009 — Modèle de données MVP

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le portfolio doit gérer profil, sections, compétences, expériences, projets, services, messages, médias, SEO, paramètres et journal.

## Problème

Un modèle trop générique créerait un CMS difficile à maintenir. Un modèle trop spécifique peut dupliquer des règles.

## Contraintes

- PostgreSQL.
- I18n FR/EN.
- Publication simple.
- Pas de versioning éditorial avancé.

## Options considérées

- Tables génériques `content`.
- Modèle relationnel par ressource portfolio.
- Stockage JSON principal.

## Décision

Utiliser un modèle relationnel par ressource portfolio, avec tables de traduction dédiées, statuts de publication et associations médias explicites.

## Justification

Ce choix garde des contraintes fortes, de la lisibilité métier et évite le CMS générique.

## Conséquences positives

- Intégrité relationnelle.
- Requêtes publiques maîtrisées.
- Modèle compréhensible par domaine.

## Conséquences négatives

- Plus de tables qu'un modèle JSON générique.
- Migrations plus nombreuses.

## Risques

- Complexité i18n si mal factorisée.

## Impacts sécurité

Messages, logs et brouillons restent dans des tables non exposées publiquement.

## Impacts données

Voir `docs/architecture/data-model.md`.

## Migration

Migrations créées progressivement :

- `V1__foundation_schema.sql` : admin et journal.
- `V2__admin_authentication.sql` : authentification admin.
- `V3__profile_and_site_settings.sql` : profil professionnel, traductions, liens, statistiques, paramètres, sections et médias principaux.

Les ressources compétences, expériences, projets, services, messages et SEO restent hors périmètre 5.3.

## Rollback

Toute refonte majeure du modèle nécessite nouvel ADR.

## ADR remplacé ou lié

Lié : ADR-0004, ADR-0005.
