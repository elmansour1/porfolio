# ADR-0001 — Stack et architecture globale du MVP

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le produit est un portfolio professionnel administrable avec site public, administration, contenus FR/EN, contact, médias, SEO et sécurité admin.

## Problème

Il faut une architecture assez robuste pour l'administration et la sécurité, sans dériver vers microservices ou CMS générique.

## Contraintes

- Budget limité.
- Aucun code existant.
- Stack cible : Angular, Java/Spring Boot, PostgreSQL, Docker.
- SEO public important.
- Un seul administrateur MVP.

## Options considérées

- Site statique sans backend.
- Monolithe modulaire Spring Boot + Angular.
- Microservices.

## Décision

Utiliser un monolithe modulaire Spring Boot pour l'API, une application Angular pour le public et l'admin, PostgreSQL, migrations versionnées et Docker Compose.

## Justification

Le monolithe modulaire couvre le besoin avec moins de complexité opérationnelle que des microservices et permet une séparation claire des domaines métier.

## Conséquences positives

- Simplicité de développement et déploiement.
- Transactions et règles métier centralisées.
- Architecture évolutive sans distribution prématurée.

## Conséquences négatives

- Une seule application backend à maintenir.
- Les frontières de modules doivent être respectées par discipline.

## Risques

- Glissement vers un CMS générique.
- Modules trop couplés si les frontières ne sont pas suivies.

## Impacts sécurité

Spring Security protège l'admin et centralise les autorisations.

## Impacts données

PostgreSQL devient source de vérité applicative.

## Migration

Aucune migration existante.

## Rollback

Revenir à une architecture différente exigerait une nouvelle décision ADR avant Phase 3.

## ADR remplacé ou lié

Lié : ADR-0002, ADR-0003, ADR-0004, ADR-0005, ADR-0007.
