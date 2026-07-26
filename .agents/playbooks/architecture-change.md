# Playbook : Changement d'architecture

## Usage

Modifier l'architecture logicielle de manière structurante.

## Exclusions

- Changements cosmétiques
- Refactoring local sans impact architectural

## Préconditions

- Besoin architectural identifié et justifié
- `GO` humain explicite (changement significatif)
- ADR préparé

## Agents

Architecte (lead), Backend, Frontend, Database, Security, DevOps/SRE

## Étapes

1. Documenter le problème architectural actuel
2. Analyser les options (minimum 2)
3. Rédiger l'ADR avec options, décision, conséquences
4. Valider l'ADR (attente validation humaine si structurant)
5. Planifier la migration progressive
6. Implémenter par étapes incrémentales
7. Tester à chaque étape
8. Auditer
9. Mettre à jour la documentation architecture
10. Clôturer

## Gates

- ADR obligatoire avant implémentation
- Validation humaine pour les changements significatifs
- Pas de big-bang — migration progressive

## Livrables

- ADR dans `docs/adr/`
- `docs/architecture/` mis à jour
- Code migré par étapes
- Plan de migration documenté

## Tests

- Tests de non-régression à chaque étape
- Tests d'intégration après migration

## Audits

- Audit architectural
- Code review
- Vérification de cohérence ADR vs implémentation

## Rollback

- Plan de rollback documenté dans l'ADR
- Revert par étape si nécessaire

## Conditions de sortie

- ADR accepté et implémentation alignée
- Documentation à jour
- Audit `CONFORME`
