# ADR-0011 — Récupération du mot de passe administrateur

## Statut

Accepté

## Date

2026-07-21

## Contexte

La sous-phase 5.1 autorise explicitement la récupération et la réinitialisation du mot de passe administrateur. ADR-0003 avait différé l'automatisation de ce flux pour le MVP.

## Problème

Il faut permettre la réinitialisation du mot de passe sans ajouter de fournisseur e-mail non décidé, sans exposer de secret dans le dépôt et sans permettre l'énumération du compte administrateur.

## Contraintes

- Un seul administrateur MVP.
- Aucun secret dans le dépôt.
- Pas de service e-mail choisi à ce stade.
- Réponses publiques génériques.
- Jetons de réinitialisation non stockés en clair.

## Options considérées

- Garder uniquement une procédure manuelle.
- Flux automatisé avec e-mail transactionnel.
- Flux applicatif avec jeton à usage unique stocké haché et délivrance out-of-band.

## Décision

Mettre en place un flux applicatif de réinitialisation avec jeton aléatoire à usage unique, expirant, stocké uniquement sous forme hachée.

Le endpoint de demande retourne toujours une réponse générique. En production, le jeton doit être délivré par un canal out-of-band contrôlé ou par une intégration e-mail future. En environnement local/test uniquement, l'exposition du jeton dans la réponse peut être activée par configuration explicite pour faciliter les tests.

## Justification

Cette solution livre le comportement métier nécessaire sans imposer un fournisseur e-mail prématuré. Elle limite l'impact sécurité par expiration courte, hachage du jeton et absence d'énumération.

## Conséquences positives

- Réinitialisation possible sans accès au code.
- Pas de dépendance e-mail structurante en Phase 5.1.
- Tests backend et frontend possibles.
- Compatible avec une future notification e-mail.

## Conséquences négatives

- En production, il faut définir le canal de remise du jeton avant usage opérationnel.
- La délivrance e-mail complète reste à décider dans une sous-phase ultérieure.

## Risques

- Mauvaise activation de l'exposition du jeton hors environnement local.
- Jeton intercepté si transmis par un canal non sûr.
- Absence de purge périodique des jetons expirés au MVP.

## Impacts sécurité

- Jeton généré avec `SecureRandom`.
- Jeton stocké haché SHA-256.
- Jeton à usage unique.
- Expiration courte.
- Réponses génériques pour éviter l'énumération.
- Journalisation sans jeton ni mot de passe.

## Impacts données

Ajout d'une table `password_reset_token` liée à `admin_user`.

## Migration

Migration Flyway additive en Phase 5.1.

## Rollback

Supprimer les jetons actifs et revenir à la procédure manuelle documentée dans ADR-0003.

## ADR remplacé ou lié

Remplace partiellement la partie "récupération différée" de ADR-0003.
