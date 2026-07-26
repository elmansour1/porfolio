# API

## Statut

Validé en Phase 2 — Architecture et conception. Endpoints d'authentification administrateur implémentés en sous-phase 5.1. Endpoints profil/paramètres implémentés en sous-phase 5.3.

## Conventions

- Préfixe API : `/api/v1`.
- API publique en lecture : `/api/v1/public/**`.
- API contact publique en écriture limitée : `/api/v1/public/contact-messages`.
- API admin protégée : `/api/v1/admin/**`.
- JSON UTF-8.
- DTO d'entrée et de sortie.
- Validation côté serveur.
- Erreurs uniformes.
- Pagination pour listes admin.
- Pas d'entités JPA exposées.
- Dates en ISO-8601.
- Langue explicite via segment de route ou paramètre `lang`.

## Format d'erreur cible

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Message utilisateur localisable",
  "details": [
    {
      "field": "email",
      "code": "INVALID_EMAIL"
    }
  ],
  "traceId": "..."
}
```

## Endpoints publics

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/v1/public/site?lang=fr` | Données composées de la landing publique | Non |
| GET | `/api/v1/public/projects/{slug}?lang=fr` | Détail projet publié | Non |
| GET | `/api/v1/public/seo?path=/&lang=fr` | Métadonnées publiques | Non |
| GET | `/api/v1/public/sitemap.xml` | Sitemap public | Non |
| GET | `/robots.txt` | Robots | Non |
| POST | `/api/v1/public/contact-messages` | Soumission formulaire contact | Non, anti-spam |
| GET | `/api/v1/public/portfolio?lang=fr` | Profil et paramètres publiables livrés en 5.3 | Non |
| GET | `/api/v1/public/profile/photo` | Photo professionnelle publiée si visible | Non |
| GET | `/api/v1/public/profile/cv` | CV PDF publié si visible et activé | Non |
| GET | `/api/v1/public/settings/logo` | Logo publié si disponible | Non |
| GET | `/api/v1/public/settings/favicon` | Favicon publié si disponible | Non |

## Endpoints auth admin

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/v1/admin/auth/login` | Connexion admin | Non |
| POST | `/api/v1/admin/auth/logout` | Déconnexion et invalidation session | Oui |
| GET | `/api/v1/admin/auth/me` | Session courante | Oui |
| GET | `/api/v1/admin/auth/csrf` | Jeton CSRF pour clients SPA | Non |
| POST | `/api/v1/admin/auth/forgot-password` | Demande de récupération mot de passe | Non |
| POST | `/api/v1/admin/auth/reset-password` | Réinitialisation par jeton | Non |

Le changement de mot de passe depuis une session connectée sera ajouté lors d'une sous-phase dédiée si nécessaire. La récupération/réinitialisation est couverte par ADR-0011.

### DTO Auth implémentés

`POST /api/v1/admin/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "MotDePasse-Securise-123"
}
```

Réponse :

```json
{
  "id": "uuid",
  "email": "admin@example.com",
  "passwordChangeRequired": false
}
```

`GET /api/v1/admin/auth/csrf`

```json
{
  "headerName": "X-XSRF-TOKEN",
  "parameterName": "_csrf",
  "token": "..."
}
```

`POST /api/v1/admin/auth/forgot-password`

```json
{
  "email": "admin@example.com"
}
```

Réponse toujours générique pour éviter l'énumération du compte. En local/test uniquement, `AUTH_RESET_TOKEN_EXPOSED=true` peut ajouter `resetToken` et `expiresAt`.

`POST /api/v1/admin/auth/reset-password`

```json
{
  "token": "jeton-recu-hors-bande",
  "newPassword": "NouveauMotDePasse-123"
}
```

Règle CSRF : les écritures admin et auth POST doivent utiliser le token obtenu via `/csrf` dans l'en-tête `X-XSRF-TOKEN`.

## Endpoints admin contenus

| Domaine | Endpoints |
|---------|-----------|
| Dashboard | `GET /api/v1/admin/dashboard` |
| Profil | `GET/PUT /api/v1/admin/profile`, `POST/GET/DELETE /api/v1/admin/profile/photo`, `POST/GET/DELETE /api/v1/admin/profile/cv` |
| Sections | Géré en 5.3 via `GET/PUT /api/v1/admin/settings` |
| Compétences | CRUD `/api/v1/admin/skill-categories`, CRUD `/api/v1/admin/skills`, ordre/publication |
| Expériences | CRUD `/api/v1/admin/experiences`, ordre/publication |
| Formations | CRUD `/api/v1/admin/education`, ordre/publication |
| Projets | CRUD `/api/v1/admin/projects`, `PUT /publish`, `PUT /archive`, `PUT /feature`, `PUT /order` |
| Services | CRUD `/api/v1/admin/services`, activation/publication/ordre |
| Témoignages | CRUD `/api/v1/admin/testimonials`, publication/ordre |
| Messages | `GET /api/v1/admin/contact-messages`, `GET /{id}`, `PUT /{id}/status`, archive/spam |
| Médias | `POST /api/v1/admin/media`, `GET /api/v1/admin/media`, `PUT /{id}`, `DELETE /{id}` |
| SEO | CRUD `/api/v1/admin/seo-metadata` |
| Paramètres | `GET/PUT /api/v1/admin/settings`, `POST/GET/DELETE /api/v1/admin/settings/logo`, `POST/GET/DELETE /api/v1/admin/settings/favicon` |
| Journal | `GET /api/v1/admin/activity-logs` |

## Pagination et tri

Paramètres standard :

- `page` : 0-based.
- `size` : limité côté serveur.
- `sort` : champ autorisé uniquement.
- `direction` : `asc` ou `desc`.

## Règles d'autorisation

- Toute route `/api/v1/admin/**` exige une session admin.
- Les écritures admin exigent CSRF valide.
- Les routes publiques ne retournent jamais messages, logs, brouillons, archives, paramètres sensibles ou médias privés.

## Collection Postman

Collection Phase 5.1 : `docs/api/postman-authentication.postman_collection.json`.

Collection Phase 5.3 : `docs/api/postman-profile-settings.postman_collection.json`.

## Contrats profil et paramètres — Phase 5.3

`GET /api/v1/admin/profile` retourne l'agrégat complet administrateur : statut, identité, disponibilité, coordonnées, visibilités, traductions `fr/en`, liens, statistiques, photo et CV.

`PUT /api/v1/admin/profile` accepte le même contrat fonctionnel, sans champs techniques obligatoires côté client. Les champs traduisibles sont portés par `translations[]`; email, téléphone, URLs, photo et CV ne sont pas dupliqués par langue.

`GET /api/v1/admin/settings` retourne le nom public du site, monogramme, langue par défaut, langues actives, email interne de réception, copyright, visibilités globales, sections configurables, logo et favicon.

`GET /api/v1/public/portfolio?lang=fr|en` retourne uniquement les données publiables :

- `settings` publics ;
- `sections` visibles ;
- `profilePublished` ;
- `profile` traduit si le profil est publié et complet pour la langue demandée.

Les réponses publiques ne retournent pas l'email interne de réception, les chemins de stockage, les logs, les identifiants d'administration ni les coordonnées masquées.

## Uploads profil — Phase 5.3

Les uploads utilisent `multipart/form-data` avec champ `file`.

| Endpoint | Formats | Taille max par défaut |
|----------|---------|-----------------------|
| `POST /api/v1/admin/profile/photo` | JPEG, PNG, WebP, AVIF | 3MB |
| `POST /api/v1/admin/profile/cv` | PDF | 5MB |
| `POST /api/v1/admin/settings/logo` | JPEG, PNG, WebP, AVIF | 3MB |
| `POST /api/v1/admin/settings/favicon` | JPEG, PNG, WebP, AVIF | 3MB |

Les suppressions sont contrôlées par endpoint dédié `DELETE`.

## Points Phase 5

- Codes d'erreur exhaustifs.
- Documentation OpenAPI si retenue.

## Dernière mise à jour

2026-07-22
