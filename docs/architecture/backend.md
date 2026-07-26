# Architecture backend

## Statut

Validé en Phase 2 — Architecture et conception. Fondation Spring Boot implémentée en Phase 4, authentification administrateur en sous-phase 5.1.

## Stack

- Java 21.
- Spring Boot 4 compatible.
- Spring Web MVC REST.
- Spring Security.
- Spring Data JPA.
- Bean Validation.
- PostgreSQL.
- Migrations versionnées.

## Structure cible

```text
backend/
  src/main/java/.../
    shared/
    auth/
    identity/
    content/
    skills/
    experience/
    projects/
    services/
    contact/
    media/
    seo/
    settings/
    audit/
```

## Structure implémentée en Phase 4

```text
backend/
  src/main/java/com/faouzi/portfolio/
    PortfolioApiApplication.java
    audit/
    auth/
    shared/
      api/
      error/
      security/
  src/main/resources/
    application.yml
    db/migration/V1__foundation_schema.sql
```

La structure Phase 5.1 ajoute le module `auth` et le journal `audit`. Les modules métier de contenu seront créés par vertical slice autorisée.

Chaque module contient ses contrôleurs, DTO, services applicatifs, domaine léger, repositories et mappers. Les conventions finales seront fixées en Phase 3.

## Règles backend

- Contrôleurs minces.
- DTO d'entrée et sortie.
- Validation Bean Validation + validations métier.
- Gestion uniforme des erreurs.
- Transactions sur services applicatifs.
- Aucun secret dans la configuration versionnée.
- Pagination pour les listes admin.
- Logs structurés sans données sensibles.
- Autorisations côté serveur pour toute API admin.

## Erreurs API

Format cible :

```json
{
  "code": "RESOURCE_NOT_FOUND",
  "message": "Message utilisateur localisable",
  "details": [],
  "traceId": "..."
}
```

La fondation Phase 4 utilise un format simple aligné sur cette cible : statut HTTP, code applicatif, message, chemin et horodatage.

## Publication

Les services de lecture publique filtrent systématiquement :

- statut `PUBLISHED` ;
- section activée ;
- langue publiée ;
- contenu non confidentiel.

Ces services métier ne sont pas encore implémentés.

## Authentification admin Phase 5.1

- Bootstrap du premier administrateur via `ADMIN_BOOTSTRAP_EMAIL` et `ADMIN_BOOTSTRAP_PASSWORD`.
- Sessions serveur Spring Security.
- CSRF via cookie `XSRF-TOKEN` et en-tête `X-XSRF-TOKEN`.
- BCrypt coût 12.
- Verrouillage après échecs configurable.
- Reset mot de passe par jeton haché, expirant et à usage unique.
- Journalisation des événements sensibles sans secrets.

## Vérifications Phase 4

- `mvn test` : PASS, 5 tests.
- `mvn package` : PASS.
- Tests API/security MockMvc : PASS.
- Migration Flyway de fondation : PASS via profil test H2.

## Vérifications Phase 5.1

- `mvn test` : PASS, 12 tests.
- Auth login/logout/session/reset/CSRF/verrouillage : PASS.

## Dernière mise à jour

2026-07-21
