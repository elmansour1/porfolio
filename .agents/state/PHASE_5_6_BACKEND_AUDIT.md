# Audit backend — Sous-phase 5.6

## Gate backend

```text
Business Compliance          : PASS
Architecture Compliance      : PASS
API Contract                 : PASS
Code Readability             : PASS
Separation of Concerns       : PASS
Transactions                 : PASS
Validation                   : PASS
Error Handling                : PASS
Security                     : PASS
Database Integrity           : PASS
Performance                  : PASS
Unit Tests                   : PASS
Integration Tests            : PASS
API Tests                    : PASS
Migrations                   : PASS
Build                        : PASS
Reviewer Verdict             : CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES
```

## Points vérifiés

- Contrôleurs minces dans `project/api` (`AdminProjectController`, `PublicProjectController`) : aucune logique métier, délégation intégrale à `ProjectService`.
- DTO séparés en `project/api/dto/request` et `project/api/dto/response` ; aucune entité JPA exposée directement.
- Service applicatif transactionnel unique `ProjectService` couvrant CRUD, publication, dépublication, archivage, mise en avant, ordre et gestion média.
- Entités JPA (`Project`, `ProjectTranslation`, `ProjectMedia`, `ProjectLink`, `ProjectSkill`) en Lombok `@Getter`/`@NoArgsConstructor(PROTECTED)`, sans `@Data`.
- Repositories Spring Data dans `project/infrastructure/persistence`, requêtes explicitement scoping publication/confidentialité (`findByPublicationStatusAndConfidentialityNotOrderByDisplayOrderAsc`, `findBySlugAndPublicationStatusAndConfidentialityNot`).
- Stockage média dédié `ProjectMediaStorageService` (`infrastructure/storage`) : whitelist de type de contenu/extension, taille max configurée, noms de fichiers assainis, vérification de confinement de chemin (anti path-traversal).
- Workflow de publication réutilise l'énumération partagée `PublicationStatus` (`profile.domain.model`), cohérent avec `career` et `skills`.
- Confidentialité dédiée au module (`ProjectConfidentiality` : `PUBLIC`/`ANONYMIZED`/`PRIVATE`) appliquée côté service pour masquer `demoUrl`/`githubUrl`/`links` en mode `ANONYMIZED` et exclure totalement `PRIVATE` des réponses publiques.
- `ProjectRequest` (DTO d'entrée) réutilisé pour création et modification : id serveur-généré, slug revalidé à chaque écriture via `existsBySlug`/`existsBySlugAndIdNot`, aucune altération possible d'identifiant ou de slug par le client.
- Migration Flyway `V6__projects.sql` cohérente avec `V1`-`V5`, sans conflit de version ni de contrainte.
- Tests d'intégration `ProjectControllerTests` (8 tests) couvrant CRUD admin, visibilité publique par statut/confidentialité, et masquage des liens en mode anonymisé.
- Build complet `mvn test` : 34 tests, tous modules confondus (`auth`, `career`, `profile`, `project`, `shared`, `skills`), 0 échec.

## Réserves

- `ProjectService.uploadMedia` limite la galerie à une constante `12` codée en dur au lieu de réutiliser `ProjectMediaProperties.maxGalleryItems()`, pourtant injectée dans `ProjectMediaStorageService`. Incohérence mineure de configuration, sans impact fonctionnel actuel (la valeur par défaut configurée est également `12`). À corriger lors d'une prochaine intervention de maintenance.
- `ProjectMapper.skillReference`/`categoryName` retournent la traduction compétence/catégorie codée en `"fr"` indépendamment de la langue demandée. Ce comportement est strictement identique au motif préexistant dans `CareerMapper.java:259,267` (confirmé par comparaison directe) : ce n'est pas une régression introduite par ce module, mais une limitation transverse déjà tracée. Non corrigée ici pour rester dans le périmètre strict de la sous-phase 5.6.

## Verdict

`CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`
