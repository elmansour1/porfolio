# Runbook

## Statut

Validé en Phase 2 — Architecture et conception.

## Incidents couverts MVP

- Site public indisponible.
- API indisponible.
- PostgreSQL indisponible.
- Echec d'envoi e-mail.
- Upload média impossible.
- Stockage média saturé.
- Suspicion de spam massif.
- Compte admin bloqué ou compromis.

## Observabilité minimale

- Health check API.
- Health check frontend.
- Health check DB.
- Logs backend structurés avec `traceId`.
- Journal métier des opérations sensibles.

## Données à ne pas logger

- Mots de passe.
- Cookies ou sessions.
- Secrets.
- Contenu complet des messages.
- Fichiers uploadés.

## Actions immédiates

| Incident | Première action |
|----------|-----------------|
| API down | Vérifier health check, logs, connexion DB |
| DB down | Vérifier service PostgreSQL, volume, espace disque |
| E-mail down | Vérifier stockage message puis configuration SMTP |
| Spam massif | Activer durcissement rate limit ou captcha si prévu |
| Admin compromis | Désactiver compte, rotation secrets, audit logs |
| Médias cassés | Vérifier volume, chemins, restauration médias |

## Dernière mise à jour

2026-07-21
