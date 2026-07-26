# Playbook : Correction de bug

## Usage

Corriger un bug identifié de manière ciblée, sans élargir le périmètre.

## Exclusions

- Refonte non nécessaire à la correction
- Nouvelles fonctionnalités
- Optimisations non liées au bug

## Préconditions

- Bug décrit avec étapes de reproduction
- Périmètre de correction défini
- `GO` pour la correction

## Agents

QA (lead), Backend/Frontend (selon le bug), Reviewer Code

## Étapes

1. Reproduire le bug
2. Identifier la cause racine
3. Définir le périmètre de correction minimal
4. Implémenter la correction
5. Écrire un test de régression
6. Exécuter les tests existants + nouveau
7. Audit code (Reviewer Code)
8. Corriger si `NON CONFORME`
9. Mettre à jour la documentation si nécessaire
10. Clôturer

## Gates

- Le test de régression doit échouer avant correction et passer après
- Pas d'élargissement de périmètre sans validation

## Livrables

- Correction du bug
- Test de régression
- Rapport d'implémentation

## Tests

- Test de régression obligatoire
- Tests existants du module concerné

## Audits

- Code review de la correction

## Rollback

- Revert du commit de correction

## Conditions de sortie

- Bug corrigé et vérifié
- Test de régression en place
- Audit `CONFORME`
