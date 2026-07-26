# Playbook : Onboarding projet existant

## Usage

Analyser un dépôt existant et aligner le framework sans réécrire le projet.

## Exclusions

- Réécriture du projet
- Remplacement de technologies fonctionnelles
- Renommage massif de fichiers

## Préconditions

- Code existant dans le dépôt
- Mode C — Projet existant détecté
- `GO` humain pour l'audit initial

## Agents

Architecte (lead), Backend, Frontend, Database, Security, DevOps/SRE, QA, Documentation

## Étapes

1. Inventorier le dépôt (technologies, structure, modules)
2. Analyser les conventions existantes
3. Analyser les routes, modèles, contrats API
4. Analyser l'authentification et les autorisations
5. Analyser les tests et l'infrastructure
6. Analyser la documentation existante
7. Comparer l'existant au besoin (`PROJECT_BRIEF.md`)
8. Documenter les écarts
9. Identifier la dette technique et les risques
10. Préparer un plan de réalignement progressif
11. Mettre à jour `PROJECT.md` et `PLANS.md`
12. Audit final

## Gates

- Aucune modification de code métier sans `GO` explicite
- Préservation des fonctionnalités opérationnelles

## Livrables

- `PROJECT.md` mis à jour avec l'état réel
- `PLANS.md` avec plan de réalignement
- `.agents/state/TECHNICAL_DEBT.md` initialisé
- `.agents/state/RISKS.md` initialisé
- Écarts documentés

## Tests

- Vérification que l'inventaire est complet
- Vérification que les écarts sont tracés

## Audits

- Audit de complétude de l'inventaire
- Audit de cohérence documentation vs code

## Rollback

- Aucune modification de code — rollback documentaire uniquement

## Conditions de sortie

- Inventaire complet et documenté
- Plan de réalignement prêt
- Audit `CONFORME` ou `CONFORME AVEC RÉSERVES`
- Statut `PHASE_CLÔTURÉE_EN_ATTENTE_DU_GO_HUMAIN`
