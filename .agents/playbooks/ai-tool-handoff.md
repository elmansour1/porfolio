# Playbook : Handoff inter-outils IA

## Usage

Préparer la reprise du travail par un agent d'un autre outil IA (Cursor, Claude, Codex, Copilot, DeepSeek, etc.).

## Exclusions

- Implémentation de nouvelles fonctionnalités
- Modification du framework

## Préconditions

- Travail en cours ou étape clôturée
- Besoin de transférer à un autre outil

## Agents

Documentation (lead), Orchestrateur

## Étapes

1. Lire l'état complet (`PROJECT_STATE.md`, `HANDOFF.md`, `PLANS.md`)
2. Résumer la dernière tâche et son résultat
3. Lister les fichiers modifiés récemment
4. Lister les décisions prises (avec références ADR)
5. Lister les tests exécutés et leurs résultats
6. Lister les audits et verdicts
7. Lister les réserves et problèmes ouverts
8. Indiquer les éléments à préserver impérativement
9. Indiquer la prochaine action autorisée
10. Indiquer le statut humain (gate en attente ou phase autorisée)
11. Mettre à jour `HANDOFF.md` via le template
12. Clôturer

## Gates

- Le handoff doit être suffisant pour reprendre sans contexte conversationnel
- Aucune information critique uniquement dans la conversation

## Livrables

- `HANDOFF.md` complet et à jour
- `PROJECT_STATE.md` synchronisé

## Tests

- Vérification qu'un agent externe peut identifier la prochaine action

## Audits

- Vérification de complétude du handoff

## Rollback

- N/A

## Conditions de sortie

- `HANDOFF.md` prêt pour reprise
- Prochaine action clairement identifiée
