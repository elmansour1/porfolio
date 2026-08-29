# API

## Statut

Partiellement documenté — sous-phase 5.9 (contact) clôturée le 2026-08-29.

## Conventions

- API REST sous `/api/v1`
- DTO d'entrée et de sortie (pas d'entités JPA exposées)
- Validation côté serveur (`jakarta.validation`)
- Codes HTTP cohérents via `ApiException`
- Pagination : `PageResponse` (`items`, `page`, `size`, `totalItems`, `totalPages`)
- Routes admin protégées par session Spring Security + CSRF

## Contact public

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/api/v1/public/contact/csrf` | Public | Retourne le token CSRF et pose le cookie `XSRF-TOKEN` |
| POST | `/api/v1/public/contact` | Public + CSRF | Soumet un message de contact (202 Accepted) |

### Corps POST `/api/v1/public/contact`

```json
{
  "name": "string (requis, max 160)",
  "email": "string (requis, email valide)",
  "company": "string | null (max 160)",
  "requestType": "GENERAL | PROJECT | JOB | PARTNERSHIP | OTHER",
  "subject": "string (requis, max 200)",
  "message": "string (requis, min 20)",
  "consent": true,
  "website": ""
}
```

- `website` : honeypot — si rempli, soumission ignorée silencieusement (202)
- `consent` : doit être `true`
- Rate limiting par IP : 5 soumissions / fenêtre (configurable via `contact.rate-limit`)

### Erreurs contact

| Code | Code métier | Cas |
|------|-------------|-----|
| 400 | validation | Champs invalides ou consentement absent |
| 429 | `CONTACT_RATE_LIMITED` | Trop de soumissions depuis la même IP |

## Messages admin

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/api/v1/admin/messages/metadata` | Admin | Statuts et types de demande |
| GET | `/api/v1/admin/messages` | Admin | Liste paginée (`?status=&page=&size=`) |
| GET | `/api/v1/admin/messages/{id}` | Admin | Détail d'un message |
| PUT | `/api/v1/admin/messages/{id}/status` | Admin + CSRF | Mise à jour du statut |

### Statuts message

`NEW`, `READ`, `TO_REPLY`, `REPLIED`, `ARCHIVED`, `SPAM`

## Autres domaines

Voir rapports de phase et collections Postman pour auth, profil, compétences, parcours, projets, services.

## Dernière mise à jour

2026-08-29
