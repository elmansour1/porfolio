# ADR-0003 — Authentification administrateur

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le MVP contient un seul administrateur et aucune application mobile native.

## Problème

Il faut protéger `/admin` et `/api/v1/admin/**` sans augmenter inutilement la surface XSS ou la complexité.

## Contraintes

- Pas d'inscription publique.
- Un seul administrateur MVP.
- Protection backend obligatoire.
- Aucun secret dans le dépôt.

## Options considérées

- JWT stocké en localStorage.
- Session serveur Spring Security avec cookie sécurisé.
- OAuth externe.

## Décision

Utiliser une session serveur Spring Security avec cookie `HttpOnly`, `Secure` en production, `SameSite=Lax` ou `Strict`, protection CSRF pour écritures admin, logout invalidant la session.

Le premier administrateur est créé par commande serveur contrôlée et idempotente si aucun admin n'existe. La récupération de mot de passe automatisée est différée ; une procédure manuelle sécurisée est retenue pour le MVP.

## Justification

La session serveur est plus simple et plus sûre pour ce MVP qu'un JWT localStorage. OAuth est disproportionné.

## Conséquences positives

- Réduction du risque de vol de token via XSS.
- Révocation simple via invalidation session.
- Moins de complexité pour un compte unique.

## Conséquences négatives

- Besoin de gérer CSRF.
- Moins adapté à une future app mobile, non incluse dans le MVP.

## Risques

- Mauvaise configuration cookie/CSRF.
- Bootstrap admin mal sécurisé.

## Impacts sécurité

Mot de passe haché avec BCrypt coût élevé ou Argon2id selon support Phase 3. Limitation des tentatives requise.

## Impacts données

Tables `admin_user`, tentatives de connexion et journal d'activité.

## Migration

Aucune donnée existante.

## Rollback

Changer de stratégie auth nécessite un nouvel ADR et migration des sessions.

## ADR remplacé ou lié

Lié : ADR-0001, ADR-0007.
