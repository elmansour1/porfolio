# Intégrations

## Statut

Validé en Phase 2 — Architecture et conception.

## Intégrations retenues MVP

| Intégration | Usage | Décision |
|-------------|-------|----------|
| SMTP configurable | Notification administrateur lors d'un message de contact | Retenu, fournisseur exact différé |
| Anti-spam léger | Réduire les soumissions automatisées | Honeypot + délai minimal + rate limiting |
| Stockage médias filesystem | Images, captures, CV PDF | Retenu pour MVP avec volume persistant |
| Reverse proxy HTTPS | TLS, routage web/API | Retenu, outil exact à confirmer en Phase 3 |
| GitHub/LinkedIn | Liens professionnels publics | Liens externes seulement |

## Intégrations différées

| Intégration | Raison |
|-------------|--------|
| Analytics | Optionnel, nécessite arbitrage confidentialité/consentement |
| Captcha externe | À introduire seulement si spam réel |
| Stockage objet externe | Différé tant que volume filesystem suffit |
| Synchronisation GitHub/LinkedIn | Hors MVP |

## Contraintes

- Secrets uniquement par variables d'environnement.
- Échec e-mail ne doit pas perdre le message.
- Médias sauvegardés avec la base ou procédure coordonnée.
- Pas de dépendance payante obligatoire pour le MVP.

## Dernière mise à jour

2026-07-21
