# ADR-0008 — Conventions API REST

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le frontend public/admin consomme le backend via API REST.

## Problème

Il faut éviter des contrats incohérents et l'exposition d'entités JPA.

## Contraintes

- Angular strict.
- Spring Boot.
- API publique et admin distinctes.

## Options considérées

- REST versionné.
- REST non versionné.
- GraphQL.

## Décision

Utiliser REST JSON versionné sous `/api/v1`, avec `/public` et `/admin`, DTO dédiés, erreurs uniformes, pagination standard et validation backend.

## Justification

REST versionné est simple, testable et suffisant pour le MVP.

## Conséquences positives

- Contrats lisibles.
- Évolution mieux maîtrisée.
- Tests API simples.

## Conséquences négatives

- Plus de DTO/mappers à maintenir.

## Risques

- Duplication de DTO si mal organisée.

## Impacts sécurité

Séparation claire API publique/admin.

## Impacts données

Aucune exposition directe du modèle de persistance.

## Migration

Implémenté progressivement :

- Sous-phase 5.1 : `/api/v1/admin/auth/**`.
- Sous-phase 5.3 : `/api/v1/admin/profile`, `/api/v1/admin/settings`, uploads médias principaux et `/api/v1/public/portfolio`.

Les entités JPA ne sont pas exposées directement.

## Rollback

Changer vers GraphQL nécessiterait nouvel ADR.

## ADR remplacé ou lié

Lié : ADR-0001.
