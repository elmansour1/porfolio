# Playbook : Incident et hotfix

## Usage

Répondre à un incident en production avec correction urgente.

## Exclusions

- Refonte non urgente
- Nouvelles fonctionnalités

## Préconditions

- Incident identifié et documenté
- Impact évalué
- `GO` pour le hotfix (peut être implicite en urgence)

## Agents

DevOps/SRE (lead), Backend/Frontend (selon l'incident), Security, QA

## Étapes

1. Documenter l'incident (symptômes, impact, chronologie)
2. Identifier la cause probable
3. Évaluer les options (hotfix, rollback, contournement)
4. Implémenter le correctif minimal
5. Tester le correctif
6. Déployer le hotfix
7. Vérifier la résolution
8. Surveiller post-déploiement
9. Rédiger le post-mortem
10. Identifier les actions préventives
11. Mettre à jour `.agents/state/RISKS.md`
12. Clôturer

## Gates

- Correctif minimal — pas d'élargissement
- Test avant déploiement même en urgence

## Livrables

- Correctif déployé
- Post-mortem documenté
- Actions préventives identifiées
- `docs/operations/runbook.md` mis à jour si applicable

## Tests

- Test du correctif
- Smoke tests post-déploiement

## Audits

- Revue rapide du correctif (peut être post-déploiement pour urgence critique)
- Post-mortem review

## Rollback

- Rollback du hotfix si aggravation
- Restauration si nécessaire

## Conditions de sortie

- Incident résolu
- Post-mortem rédigé
- Surveillance en place
