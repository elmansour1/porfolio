# Architecture backend

## Statut

Validé en Phase 2 — Architecture et conception. Fondation Spring Boot implémentée en Phase 4, authentification administrateur en sous-phase 5.1, profil/paramètres en 5.3, compétences/catégories en 5.4, parcours en 5.5, projets en 5.6 et services/méthode en 5.7.

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

La structure Phase 5.1 ajoute le module `auth` et le journal `audit`. La sous-phase 5.3 ajoute le module `profile`. La sous-phase 5.4 ajoute le module `skills`. La sous-phase 5.7 ajoute le module `service`.

Structure par module :

```text
<module>/
  api/
    dto/
      request/
      response/
  application/
    dto/
    mapper/
    service/
  domain/
    model/
  infrastructure/
    persistence/
    storage/
```

Chaque module contient ses contrôleurs, DTO, services applicatifs, domaine léger, repositories et mappers selon le besoin.

Règles de structure :

- les contrôleurs REST restent dans `api` ;
- les contrats REST d'entrée/sortie restent dans `api.dto.request` et `api.dto.response` ;
- les services applicatifs restent dans `application.service` ;
- les mappings DTO/réponse restent dans `application.mapper` lorsqu'ils évitent de charger les services ;
- les DTO/résultats applicatifs restent dans `application.dto` lorsqu'ils sont échangés entre services et API ;
- les entités, enums et value objects de domaine restent dans `domain.model` ;
- les repositories Spring Data restent dans `infrastructure.persistence`, pas dans `domain` ;
- les adaptateurs techniques de stockage restent dans `infrastructure.storage` ;
- aucune entité JPA ne doit être appelée DTO JPA ;
- les projections JPA éventuelles devront être placées dans `infrastructure.persistence` ou un sous-package dédié de cette couche.

Correctif qualité 2026-07-26 :

- repositories déplacés hors de `domain` vers `infrastructure.persistence` ;
- entités JPA annotées avec Lombok `@Getter` et `@NoArgsConstructor(access = AccessLevel.PROTECTED)` ;
- DTO REST déplacés dans `api.dto` ;
- modèles de domaine déplacés dans `domain.model` ;
- DTO/résultats applicatifs déplacés dans `application.dto` ;
- `@Data` reste interdit sur les entités JPA.

Restructuration architecturale exceptionnelle 2026-07-26 :

- services applicatifs déplacés dans `application.service` ;
- stockage média déplacé dans `profile.infrastructure.storage` ;
- DTO REST séparés par usage dans `api.dto.request` et `api.dto.response` ;
- mappers backend créés pour `profile` et `skills` dans `application.mapper` ;
- contrôleurs et services convertis à l'injection Lombok `@RequiredArgsConstructor` ;
- aucun constructeur manuel de service restant ;
- aucun package plat `api.dto`, `application` ou `domain` ne contient de classe métier directement.

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

Ces règles sont implémentées pour le profil/paramètres, les compétences, le parcours, les projets, les services et les étapes de méthode.

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

## Vérifications Phase 5.4

- `mvn test` : PASS, 22 tests.
- `mvn package` : PASS, 22 tests.
- API compétences admin/public : PASS.
- Filtrage public brouillons/archives/visibilité/traductions : PASS.
- Accès admin anonyme refusé : PASS.

## Vérifications Phase 5.7

- `mvn test` : PASS, 40 tests.
- Migration `V7__professional_services.sql` : PASS via profil test H2/Flyway.
- API services admin/public : PASS.
- API étapes de méthode admin/public : PASS.
- Publication, dépublication, archivage, mise en avant, ordre, CTA et filtrage public : PASS.
- Accès admin anonyme refusé : PASS.
- Scan Lombok interdit (`@Data`, `@Setter`, `@SneakyThrows`) dans `service` : PASS.

## Vérifications restructuration 2026-07-26

- `mvn test` : PASS, 22 tests.
- `mvn package` : PASS, 22 tests.
- Scan `@Data` : PASS, aucun usage.
- Scan constructeurs de services : PASS, aucun constructeur manuel.
- Scan packages plats `api.dto`, `application`, `domain` : PASS, aucune classe métier directe.

## Dernière mise à jour

2026-08-03
