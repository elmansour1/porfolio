# Rapport de correctif — Traductions du profil en doublon

## Date

2026-07-26

## Problème

La sauvegarde du profil administrateur pouvait échouer avec PostgreSQL :

```text
ERROR: duplicate key value violates unique constraint "uk_profile_translation_locale"
Detail: Key (profile_id, language_code)=(..., fr) already exists.
```

## Cause

`PortfolioProfileService.replaceTranslations` supprimait toutes les traductions du profil avec `deleteByProfileId(profileId)` puis recréait les traductions dans la même transaction.

Avec Hibernate/PostgreSQL, l'ordre effectif des opérations SQL peut laisser l'ancienne ligne `(profile_id, language_code)` présente au moment de l'insert, ce qui viole la contrainte unique `uk_profile_translation_locale`.

## Correction

La méthode synchronise maintenant les traductions par langue :

- lecture des traductions existantes du profil ;
- mise à jour de la traduction existante si la langue est déjà présente ;
- création uniquement pour une nouvelle langue ;
- suppression des traductions retirées de la requête.

Le contrat API et le schéma de base de données ne changent pas.

## Fichiers modifiés

- `backend/src/main/java/com/faouzi/portfolio/profile/application/service/PortfolioProfileService.java`
- `backend/src/test/java/com/faouzi/portfolio/profile/PortfolioProfileControllerTests.java`

## Test de non-régression

Ajout du test `updatesExistingProfileTranslationForSameLocale`, qui sauvegarde deux fois le profil avec la langue `fr` et vérifie que la traduction existante est mise à jour sans doublon.

## Vérifications exécutées

- `mvn test` : PASS, 23 tests.
- `mvn package` : PASS, 23 tests, jar généré.
- `docker compose build api` : PASS, image `portfolio-api:latest` construite.

## Vérifications non exécutées

- Test manuel navigateur non exécuté dans ce correctif.
- Démarrage complet `docker compose up` non exécuté.

## Verdict

`CONFORME`
