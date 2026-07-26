# ADR-0006 — Contact, e-mail et anti-spam

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le formulaire de contact doit créer des messages admin et notifier le propriétaire.

## Problème

L'e-mail peut échouer et le formulaire peut recevoir du spam.

## Contraintes

- Budget limité.
- Pas de CRM.
- Données personnelles à protéger.

## Options considérées

- Envoi e-mail seulement sans stockage.
- Stockage puis notification e-mail.
- Service anti-spam externe obligatoire.

## Décision

Stocker le message valide avant toute notification. Tenter ensuite l'envoi e-mail via SMTP configuré par variables d'environnement. Utiliser validation backend, honeypot, délai minimal, rate limiting et statut `SPAM`. Captcha différé jusqu'à problème concret.

## Justification

Le stockage d'abord évite la perte de messages. L'anti-spam léger répond au MVP sans dépendance externe forte.

## Conséquences positives

- Message conservé même si l'e-mail échoue.
- Moins de dépendance externe.
- Spam classable depuis l'administration.

## Conséquences négatives

- Rate limiting et honeypot à tester soigneusement.
- Captcha pourrait devenir nécessaire plus tard.

## Risques

- Spam si protections insuffisantes.
- Mauvaise gestion des données personnelles.

## Impacts sécurité

Validation stricte, logs sans contenu complet du message.

## Impacts données

Tables `contact_message` et éventuellement historique de statut.

## Migration

Aucune donnée existante.

## Rollback

Changer de fournisseur e-mail ne doit pas modifier le domaine.

## ADR remplacé ou lié

Lié : ADR-0003, ADR-0007.
