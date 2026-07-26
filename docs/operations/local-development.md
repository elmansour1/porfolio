# Développement local

## Statut

Mis à jour en sous-phase 5.3 — Profil professionnel et paramètres généraux.

## Prérequis

- Java 21.
- Maven 3.8+.
- Node.js `^20.19.0 || ^22.12.0 || >=24.0.0` pour Angular 20.
- npm `>=10.8.0`.
- Docker et Docker Compose pour l'environnement complet.

Note : l'environnement local actuel dispose de Node 18. Les commandes frontend ont donc été vérifiées avec Node 20 temporaire via `npx -p node@20 -p npm@10`.

## Structure applicative

| Chemin | Rôle |
|--------|------|
| `backend/` | API Spring Boot 4, sécurité minimale, Flyway, tests JUnit/MockMvc |
| `frontend/` | Angular 20 SSR, zoneless, Tailwind, PrimeNG, ngx-translate, tests Karma |
| `docker-compose.yml` | PostgreSQL, API, web SSR, volumes persistants |
| `.env.example` | Variables locales sans secret réel |

## Backend

Commandes :

```bash
cd backend
mvn test
mvn package
mvn spring-boot:run
```

Endpoints de fondation :

- `GET /api/v1/public/status`
- `GET /actuator/health`
- `GET /api/v1/public/portfolio?lang=fr`

Les routes `/api/v1/admin/**` sont protégées et renvoient `401` sans authentification.

### Premier administrateur

Le premier compte administrateur est créé au démarrage si la base ne contient aucun administrateur et si les deux variables sont définies :

```bash
ADMIN_BOOTSTRAP_EMAIL=admin@example.com
ADMIN_BOOTSTRAP_PASSWORD='MotDePasse-Securise-123'
```

Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un symbole.

Ne pas utiliser de secret réel dans `.env.example` ou dans le dépôt.

### Récupération de mot de passe

En production, `AUTH_RESET_TOKEN_EXPOSED=false` doit rester la valeur par défaut. Le jeton doit être remis par un canal sécurisé hors application ou par une intégration e-mail future.

En local/test uniquement, `AUTH_RESET_TOKEN_EXPOSED=true` peut exposer le jeton dans la réponse API pour faciliter la vérification manuelle.

## Frontend

Avec Node 20 installé :

```bash
cd frontend
npm install
npm run lint
npm run test:ci
npm run build
npm run serve:ssr
```

Dans l'environnement courant avec Node temporaire :

```bash
npx -y -p node@20 -p npm@10 npm --prefix frontend install
npx -y -p node@20 -p npm@10 npm --prefix frontend run lint
npx -y -p node@20 -p npm@10 npm --prefix frontend run test:ci
npx -y -p node@20 -p npm@10 npm --prefix frontend run build
cd frontend && npx -y -p node@20 node dist/frontend/server/server.mjs
```

Routes de fondation :

- `/` : placeholder public de fondation.
- `/admin/login` : connexion admin.
- `/admin` : redirection vers `/admin/dashboard`.
- `/admin/dashboard` : dashboard admin.
- `/admin/forbidden` : accès refusé.
- `/admin/session-expired` : session expirée.
- `/admin/**` inconnu : page admin introuvable dans le shell.

Les routes de gestion de contenu restent désactivées tant que leurs sous-phases ne sont pas autorisées.

Les routes `/admin/**` sont servies en rendu client. Cela évite que le guard admin soit évalué côté SSR sans les cookies navigateur et permet le reload direct des routes admin dans Docker.

### Frontend avec proxy API local

Pour tester l'administration avec un backend local ou Docker exposé sur `localhost:8080` :

```bash
cd frontend
npm run ng -- serve --host 127.0.0.1 --port 4200 --proxy-config proxy.conf.json
```

Le fichier `frontend/proxy.conf.json` relaie `/api` et `/actuator` vers l'API locale. Il est destiné au développement local uniquement.

## Docker Compose

Préparer les variables :

```bash
cp .env.example .env
```

Valider la configuration :

```bash
docker compose config
```

Démarrer l'environnement complet :

```bash
docker compose up --build
```

La configuration Compose a été validée. Le service `web` expose le site et l'administration sur `http://localhost:4000` et relaie `/api` vers le service `api` via `API_ORIGIN`.

Si la base Docker ne contient aucun administrateur, définir temporairement `ADMIN_BOOTSTRAP_EMAIL` et `ADMIN_BOOTSTRAP_PASSWORD`, démarrer l'API une fois, puis redémarrer sans ces variables. Le bootstrap est idempotent et ne crée un compte que si la table `admin_user` est vide.

## Variables d'environnement

Voir `.env.example`.

Règles :

- ne pas commiter `.env` ;
- remplacer tous les secrets locaux avant usage réel ;
- configurer `NG_ALLOWED_HOSTS` avec les domaines autorisés pour le SSR ;
- configurer `API_ORIGIN=http://api:8080` pour que le serveur web relaie `/api` vers le backend dans Docker ;
- configurer `SESSION_COOKIE_SECURE=true` en production HTTPS.
- configurer `MEDIA_STORAGE_PATH` vers un volume persistant sauvegardé pour photo, CV, logo et favicon.

### Médias profil et paramètres

Valeurs par défaut :

- `MEDIA_STORAGE_PATH=/app/media` en Docker ;
- taille image max : 3MB ;
- taille PDF max : 5MB ;
- images acceptées : JPEG, PNG, WebP, AVIF ;
- CV accepté : PDF uniquement.

Sauvegarder et restaurer le volume `media-data` avec la base PostgreSQL pour conserver la cohérence entre métadonnées et fichiers.

## Vérifications Phase 4

| Vérification | Résultat |
|--------------|----------|
| Backend `mvn package` | PASS |
| Backend tests | PASS — 5 tests |
| Frontend lint | PASS |
| Frontend tests | PASS — 4 tests Chrome Headless |
| Frontend build SSR | PASS |
| Backend auth Phase 5.1 | PASS — login/logout/session/reset/verrouillage/CSRF |
| Frontend auth Phase 5.1 | PASS — pages, services, build |
| Docker Compose config | PASS |
| Docker Compose build | PASS — vérifié en sous-phase 5.1 |
| Inspection visuelle fondation | PASS — public desktop, admin mobile |

## Vérifications Phase 5.2

| Vérification | Résultat |
|--------------|----------|
| Frontend lint | PASS |
| Frontend tests | PASS — 17 tests Chrome Headless |
| Frontend build SSR | PASS |
| Backend `mvn package` | PASS — 12 tests, auth non régressée |
| npm audit | FAIL — 3 vulnérabilités modérées tooling Angular CLI |
| Inspection visuelle admin | PASS — dashboard desktop/laptop/tablette/mobile, menu mobile, 404, 403, session expirée |

## Vérifications Phase 5.3

| Vérification | Résultat |
|--------------|----------|
| Backend `mvn test` | PASS — 17 tests |
| Backend `mvn package` | PASS — 17 tests |
| Frontend lint | PASS |
| Frontend tests | PASS — 21 tests Chrome Headless |
| Frontend build SSR | PASS |
| npm audit | FAIL — 3 vulnérabilités modérées tooling Angular CLI |
| Inspection visuelle profil/paramètres/public | PASS — desktop/mobile sans overflow |

## Dernière mise à jour

2026-07-22
