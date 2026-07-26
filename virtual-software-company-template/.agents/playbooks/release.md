# Playbook : Release

## Usage

Préparer et exécuter une livraison en production.

## Exclusions

- Nouvelles fonctionnalités non testées
- Migrations non validées

## Préconditions

- Fonctionnalités de la release clôturées et auditées
- Tests de régression passés
- `GO` pour la release

## Agents

DevOps/SRE (lead), QA, Security, Backend, Frontend, Documentation

## Étapes

1. Identifier le contenu de la release (version, changelog)
2. Vérifier les migrations en attente
3. Exécuter les tests de régression complets
4. Vérifier la checklist release
5. Préparer la sauvegarde
6. Préparer le plan de déploiement
7. Préparer le plan de rollback
8. Déployer
9. Smoke tests post-déploiement
10. Surveiller les métriques et logs
11. Documenter la release
12. Clôturer

## Gates

- Checklist release complète (`.agents/checklists/release-quality.md`)
- Sauvegarde effectuée
- Plan de rollback prêt

## Livrables

- Release déployée
- Notes de version
- `docs/operations/deployment.md` mis à jour si nécessaire
- Rapport de release (`.agents/templates/release-template.md`)

## Tests

- Régression complète
- Smoke tests post-déploiement
- Vérification health checks

## Audits

- Audit release (checklist)
- Vérification sécurité (pas de secrets exposés)

## Rollback

- Exécuter le plan de rollback documenté
- Voir `docs/operations/rollback.md`

## Conditions de sortie

- Release déployée et stable
- Smoke tests passés
- Documentation à jour
