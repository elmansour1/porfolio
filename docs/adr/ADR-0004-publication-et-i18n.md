# ADR-0004 — Publication et internationalisation des contenus

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le site public doit afficher uniquement les contenus publiés et supporter français/anglais.

## Problème

Un vrai versioning brouillon/publication complet complique fortement le MVP. Un fallback français automatique sur une page anglaise peut dégrader la qualité perçue.

## Contraintes

- Français langue par défaut.
- Anglais requis dans le MVP.
- Contenus brouillons et archivés jamais publics.
- Prévisualisation souhaitable mais non prioritaire.

## Options considérées

- Versioning éditorial complet.
- Statut simple par contenu.
- Publication par langue avec tables de traduction.

## Décision

Utiliser un statut simple `DRAFT`, `PUBLISHED`, `ARCHIVED` sur les ressources publiables et des tables `*_translation` par ressource. Une ressource est visible dans une langue seulement si la ressource est `PUBLISHED` et si la traduction de cette langue est complète/publiable.

Le fallback français automatique n'est pas retenu pour les contenus publics métier, sauf micro-libellés d'interface.

## Justification

Ce choix garde le MVP simple tout en évitant des pages anglaises partiellement françaises.

## Conséquences positives

- Règles public/admin lisibles.
- Requêtes publiques sûres.
- I18n traitée comme donnée métier.

## Conséquences négatives

- L'admin doit signaler les traductions manquantes.
- Une ressource publiée en français peut ne pas apparaître en anglais tant que la traduction manque.

## Risques

- Frustration si la traduction retarde la publication anglaise.

## Impacts sécurité

Réduit le risque de publication accidentelle de brouillons.

## Impacts données

Tables de traduction par agrégat et contraintes `unique(parent_id, locale)`.

## Migration

Implémenté partiellement en sous-phase 5.3 pour le profil professionnel :

- `professional_profile.publication_status` ;
- `professional_profile_translation(language_code)` ;
- publication publique uniquement si le profil est `PUBLISHED` et si la traduction demandée est complète ;
- pas de fallback français automatique pour les contenus métier publics.

Aucune donnée métier existante n'a été migrée.

## Rollback

Un modèle de versioning complet nécessiterait un nouvel ADR.

## ADR remplacé ou lié

Lié : ADR-0001, ADR-0002.
