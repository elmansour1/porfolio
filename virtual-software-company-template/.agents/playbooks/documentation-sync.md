# Playbook : Synchronisation documentation

## Usage

Réaligner la documentation avec l'état réel du code et des décisions.

## Exclusions

- Modification de code (sauf correction de documentation inline)

## Préconditions

- Écart documentation/code identifié
- `GO` pour la synchronisation

## Agents

Documentation (lead), Architecte, agents concernés par le périmètre

## Étapes

1. Identifier les écarts (documentation vs code vs ADR vs état)
2. Prioriser les écarts critiques
3. Mettre à jour les documents concernés
4. Marquer les sections obsolètes
5. Vérifier la cohérence inter-documents
6. Mettre à jour `HANDOFF.md`
7. Audit de cohérence
8. Clôturer

## Gates

- Le code réel prévaut sur une documentation obsolète
- Les écarts doivent être signalés, pas masqués

## Livrables

- Documents mis à jour dans `docs/`
- `PROJECT.md`, `PLANS.md` alignés
- Écarts résiduels documentés

## Tests

- Vérification de cohérence inter-documents
- Vérification que les ADR reflètent les décisions actuelles

## Audits

- Audit de complétude et cohérence documentaire

## Rollback

- Restauration des versions précédentes des documents

## Conditions de sortie

- Écarts critiques corrigés
- Écarts résiduels tracés
- Audit `CONFORME`
