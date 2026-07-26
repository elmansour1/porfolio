# Déploiement

## Statut

Mis à jour en sous-phase 5.1 — Authentification administrateur.

## Stratégie MVP

Déploiement Docker Compose sur un hébergement supportant Docker, PostgreSQL persistant, volumes médias, domaine personnalisé et HTTPS.

## Services de production

- Reverse proxy HTTPS, recommandé : Caddy ou équivalent simple.
- `web` : Angular SSR pour routes publiques et admin CSR.
- `api` : Spring Boot.
- `postgres` : PostgreSQL avec volume persistant.
- Volume médias.

## Fondations créées

- `docker-compose.yml` avec services `web`, `api`, `postgres`.
- `backend/Dockerfile`.
- `frontend/Dockerfile`.
- Volumes `postgres-data` et `media-data`.
- Health checks Compose pour PostgreSQL, API et web.
- `.env.example` sans secret réel.

## Contraintes

- HTTPS obligatoire.
- Aucun secret dans l'image ou le dépôt.
- Variables d'environnement par environnement.
- Health checks pour `web`, `api`, `postgres`.
- Logs structurés backend.
- Sauvegarde base + médias avant release risquée.
- Configurer `NG_ALLOWED_HOSTS` avec le domaine public réel avant production.

## Vérification Phase 4

- `docker compose config` : PASS.
- `docker compose build` : NOT EXECUTED, échec de résolution des images Docker Hub dans l'environnement courant.

Cause :
Docker n'a pas pu joindre `registry-1.docker.io` pour les images `node:20-alpine` et `maven:3.9-eclipse-temurin-21`.

Risque résiduel :
Les Dockerfiles sont cohérents statiquement mais le build d'images doit être relancé dans un environnement avec accès Docker Hub.

## Vérification Phase 5.1

- `docker compose config` : PASS.
- `docker compose build` : PASS.
- Images construites : `portfolio-api`, `portfolio-web`.

Variables auth à fournir par environnement :

- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `AUTH_LOGIN_MAX_FAILURES`
- `AUTH_LOGIN_LOCK_DURATION`
- `AUTH_RESET_TOKEN_TTL`
- `AUTH_RESET_TOKEN_EXPOSED`

En production, `AUTH_RESET_TOKEN_EXPOSED=false` est obligatoire.

## Critères de choix hébergeur

- Coût faible.
- Support Docker Compose ou équivalent.
- Volumes persistants fiables.
- Sauvegardes PostgreSQL et médias.
- Domaine et TLS.
- Possibilité rollback.
- Localisation des données acceptable pour les marchés ciblés.

## Non retenu MVP

- Kubernetes.
- Microservices.
- Infrastructure multi-région.
- CI/CD complexe.

## Dernière mise à jour

2026-07-21
