# ADR-0007 — Déploiement Docker Compose

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le MVP doit être déployable simplement avec budget limité.

## Problème

Il faut héberger frontend SSR, backend, PostgreSQL et médias persistants sans infrastructure complexe.

## Contraintes

- Pas de Kubernetes.
- Docker Compose souhaité.
- HTTPS obligatoire en production.
- Sauvegardes nécessaires.

## Options considérées

- Hébergement statique uniquement.
- VPS/plateforme Docker Compose.
- Kubernetes.

## Décision

Utiliser Docker Compose avec reverse proxy HTTPS, conteneur `web`, conteneur `api`, PostgreSQL avec volume, volume médias et variables d'environnement.

## Justification

Docker Compose est proportionné au MVP et compatible avec un hébergement économique.

## Conséquences positives

- Déploiement compréhensible.
- Environnements local/staging/production proches.
- Rollback par version d'image possible.

## Conséquences négatives

- Exploitation serveur à maintenir.
- Sauvegardes à organiser explicitement.

## Risques

- Mauvaise persistance des médias.
- Sauvegardes non testées.

## Impacts sécurité

HTTPS, secrets par environnement, aucun secret commité.

## Impacts données

Sauvegarde coordonnée PostgreSQL + médias.

## Migration

Aucune donnée existante.

## Rollback

Retour à la version d'image précédente avec procédure rollback documentée.

## ADR remplacé ou lié

Lié : ADR-0002, ADR-0005.
