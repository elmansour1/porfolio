# ADR-0012 — Restructuration architecturale senior

## Statut
Accepté

## Date
2026-07-26

## Contexte

Les sous-phases 5.1 à 5.4 ont livré les fondations, l'authentification, le layout admin, le profil/paramètres et les compétences. Après ces incréments, plusieurs classes restaient correctement fonctionnelles mais insuffisamment organisées pour la suite du MVP.

## Problème

Les écarts principaux étaient :

- DTO REST regroupés dans des packages `api.dto` plats ;
- services applicatifs placés directement dans `application` ;
- mappings DTO concentrés dans des services volumineux ;
- stockage média dans la couche application ;
- types frontend de formulaire et de sélection définis dans des pages ;
- composants UI admin partagés non regroupés explicitement.

## Contraintes

- Ne pas ajouter de fonctionnalité.
- Ne pas changer les routes ni les contrats HTTP sans nécessité.
- Préserver les tests existants.
- Garder une architecture proportionnée au MVP.
- Utiliser Lombok sans `@Data` sur les entités JPA.

## Options considérées

1. Conserver la structure actuelle et documenter la dette.
2. Introduire une architecture hexagonale complète avec ports/adaptateurs métier pour chaque repository.
3. Restructurer progressivement par domaine avec sous-packages explicites, DTO séparés et mappers ciblés.

## Décision

Retenir l'option 3.

La structure backend cible des modules implémentés est :

```text
<module>/
  api/
    dto/request/
    dto/response/
  application/
    dto/
    mapper/
    service/
  domain/model/
  infrastructure/
    persistence/
    storage/
```

La structure frontend cible des features admin implémentées est :

```text
admin/<feature>/
  api/
  mappers/
  models/
    dto/
    forms/
  pages/
```

Les composants UI admin partagés sont placés dans `admin/shared/ui`. Les modèles réellement génériques, comme `SelectOption`, sont placés dans `src/app/shared/models`.

## Justification

Cette structure corrige les défauts observés sans introduire CQRS complet, ports/adaptateurs systématiques ou duplication domaine/JPA artificielle. Elle donne une frontière claire pour les prochaines sous-phases métier tout en conservant le comportement existant.

## Conséquences positives

- Contrats HTTP lisibles par usage.
- Services applicatifs plus concentrés sur orchestration, transactions et règles.
- Conversions DTO centralisées dans des mappers ciblés.
- Frontend plus clair entre DTO API, modèles de formulaire, mappers et pages.
- Lombok réduit le bruit d'injection sans masquer les entités.

## Conséquences négatives

- Imports modifiés dans plusieurs modules.
- Les pages Angular restent volumineuses pour certaines features, même si leurs types et mappings principaux sont désormais extraits.

## Risques

- Les futurs développements peuvent recréer des packages plats s'ils ne suivent pas les conventions.
- Les mappers manuels exigent des tests lorsque les contrats évoluent.

## Impacts sécurité

Pas de changement fonctionnel de sécurité. Les endpoints admin restent protégés par Spring Security et CSRF. Les réponses publiques restent filtrées par les services existants.

## Impacts données

Aucun changement de schéma et aucune migration.

## Migration

Déplacement de fichiers Java/TypeScript, mise à jour des packages/imports et validation par builds/tests.

## Rollback

Rollback par revert Git des déplacements et imports associés si nécessaire. Aucun état base de données n'est modifié.

## ADR remplacé ou lié

Lié à ADR-0001, ADR-0008 et ADR-0010.
