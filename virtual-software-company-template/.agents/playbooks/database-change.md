# Playbook : Changement de base de données

## Usage

Modifier le schéma, ajouter des migrations ou changer le modèle de données.

## Exclusions

- Modifications manuelles non tracées
- Changements sans migration versionnée

## Préconditions

- Besoin identifié et justifié
- Modèle actuel documenté
- `GO` pour le changement
- Sauvegarde avant migration risquée

## Agents

Database (lead), Backend, Architecte, Security

## Étapes

1. Analyser le modèle actuel
2. Concevoir le nouveau modèle (contraintes, cardinalités, index)
3. Rédiger la migration versionnée
4. Définir la stratégie de rollback
5. Valider l'impact sur le code existant
6. Exécuter la migration en environnement de test
7. Adapter le code applicatif
8. Tester l'intégrité des données
9. Auditer (database + code)
10. Mettre à jour la documentation
11. Clôturer

## Gates

- Migration versionnée obligatoire
- Sauvegarde avant migration risquée
- ADR si changement structurant du modèle

## Livrables

- Script de migration
- Code applicatif adapté
- Documentation du modèle mise à jour
- Stratégie de rollback

## Tests

- Test de migration (up et down)
- Tests d'intégrité des données
- Tests applicatifs impactés

## Audits

- Audit database (`.agents/checklists/database-quality.md`)
- Code review des adaptations

## Rollback

- Script de rollback de migration
- Restauration de sauvegarde si nécessaire

## Conditions de sortie

- Migration exécutée et testée
- Intégrité vérifiée
- Audit `CONFORME`
