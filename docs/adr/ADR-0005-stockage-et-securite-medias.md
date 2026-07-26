# ADR-0005 — Stockage et sécurité des médias

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le portfolio doit gérer images, captures et CV PDF.

## Problème

Les uploads sont une surface sécurité importante et peuvent dégrader les performances.

## Contraintes

- Budget limité.
- Hébergement encore à choisir.
- Besoin de médias persistants.
- Confidentialité des projets.

## Options considérées

- Stockage en base.
- Stockage filesystem persistant.
- Service objet externe.

## Décision

Utiliser un stockage filesystem persistant pour le MVP, avec métadonnées en base. Autoriser images `jpg`, `jpeg`, `png`, `webp`, `avif` si supporté, et PDF pour CV. Refuser SVG uploadé, exécutables, archives, HTML et scripts.

## Justification

Le filesystem persistant est simple, peu coûteux et suffisant pour le MVP.

## Conséquences positives

- Simplicité.
- Sauvegarde maîtrisable avec volume médias.
- Migration future possible vers stockage objet.

## Conséquences négatives

- Le déploiement doit gérer un volume persistant.
- Sauvegarde base + médias à coordonner.

## Risques

- Mauvaise validation MIME.
- Médias trop lourds.
- Suppression de médias utilisés.

## Impacts sécurité

Whitelist, contrôle taille/MIME/dimensions, nom aléatoire, stockage hors chemin exécutable, vérification d'usage avant suppression.

## Impacts données

Table `media_asset` et associations explicites.

## Migration

Implémenté partiellement en sous-phase 5.3 avec `profile_media` et stockage filesystem pour photo, CV, logo et favicon. Les formats acceptés sont contrôlés par whitelist, les noms stockés sont aléatoires et les fichiers remplacés sont supprimés lorsque possible.

Aucune donnée média existante n'a été migrée.

## Rollback

Retour à stockage base ou externe nécessiterait nouvel ADR.

## ADR remplacé ou lié

Lié : ADR-0007.
