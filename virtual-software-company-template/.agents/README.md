# .agents — Coeur opérationnel de l'entreprise virtuelle

## Rôle

Ce répertoire contient le coeur opérationnel du framework d'entreprise virtuelle d'ingénierie logicielle. Il est **générique et réutilisable** : il ne contient aucune donnée métier, aucune décision produit, aucun historique de projet.

## Structure

```
.agents/
├── README.md              ← Ce fichier
├── ORCHESTRATOR.md        ← Protocole de l'orchestrateur
├── agents/                ← Fiches des agents spécialisés
├── playbooks/             ← Procédures opérationnelles
├── templates/             ← Modèles de documents
├── checklists/            ← Critères de qualité et clôture
└── state/                 ← État du projet (spécifique, réinitialisable)
```

## Utilisation

1. Lire `AGENTS.md` à la racine du dépôt
2. Lire `.agents/ORCHESTRATOR.md` pour le protocole d'exécution
3. Consulter la fiche de l'agent concerné dans `agents/`
4. Sélectionner le playbook adapté dans `playbooks/`
5. Utiliser les templates dans `templates/` pour produire les livrables
6. Vérifier les checklists dans `checklists/` avant clôture
7. Mettre à jour l'état dans `state/`

## Règles

- Les fichiers hors `state/` sont génériques et ne doivent pas contenir de données projet
- Le répertoire `state/` est réinitialisable pour chaque nouveau projet
- Toute modification du framework nécessite un dysfonctionnement concret observé
- Les adaptateurs d'outils (`.cursor/`, `.codex/`, etc.) renvoient ici, sans dupliquer les règles

## Export

Une version template exportable est disponible dans `virtual-software-company-template/` à la racine du dépôt.
