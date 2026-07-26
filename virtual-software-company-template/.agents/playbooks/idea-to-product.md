# Playbook : Idée vers produit

## Usage

Transformer une idée brute en vision produit structurée avec MVP défini.

## Exclusions

- Implémentation technique
- Architecture détaillée
- Choix de stack (sauf référence par défaut)

## Préconditions

- `PROJECT_BRIEF.md` renseigné (au minimum l'idée principale)
- Mode A — Nouvelle idée détecté
- `GO` humain pour la phase de cadrage produit

## Agents

Product (lead), Métier, UX/UI (consultation)

## Étapes

1. Analyser l'idée et le brief
2. Identifier le problème utilisateur
3. Identifier les acteurs et personas
4. Formuler la proposition de valeur
5. Définir le MVP et les exclusions
6. Identifier les hypothèses et risques
7. Prioriser les fonctionnalités
8. Rédiger les exigences fonctionnelles et non fonctionnelles
9. Produire les livrables dans `docs/product/`
10. Audit final

## Gates

- Validation produit par l'Agent Product
- Pas d'implémentation sans `GO` pour la phase suivante

## Livrables

- `docs/product/vision.md`
- `docs/product/scope.md`
- `docs/product/actors-and-roles.md`
- `docs/product/user-journeys.md`
- `docs/product/functional-requirements.md`
- `docs/product/non-functional-requirements.md`
- `PROJECT.md` mis à jour

## Tests

- Vérification de cohérence interne des documents produit
- Vérification que le MVP est testable et limité

## Audits

- Audit produit (Agent Product + Reviewer)
- Audit de complétude des livrables

## Rollback

- Aucun code à rollback
- Les documents peuvent être révisés avant clôture

## Conditions de sortie

- Tous les livrables produits
- Audit `CONFORME` ou `CONFORME AVEC RÉSERVES`
- Statut `PHASE_CLÔTURÉE_EN_ATTENTE_DU_GO_HUMAIN`
