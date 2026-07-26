# Playbook : Exécution de phase

## Usage

Exécuter une phase ou sous-phase autorisée de bout en bout, de l'étape initiale à la clôture.

## Exclusions

- Phases non autorisées par `HUMAN_GATES.md`
- Tâches hors périmètre de la phase

## Préconditions

- Phase en état `AUTHORIZED` dans `HUMAN_GATES.md`
- Dépendances de la phase satisfaites
- `PLANS.md` à jour

## Agents

Selon le type de phase (voir `ORCHESTRATOR.md` section Sélection des agents)

## Étapes

1. Vérifier le `GO` dans `HUMAN_GATES.md`
2. Lire le contexte complet
3. Identifier la première étape non terminée
4. Pour chaque étape :
   a. Sélectionner le playbook spécifique si applicable
   b. Préparer le brief (template tâche)
   c. Consulter les agents
   d. Consolider
   e. Implémenter (si applicable)
   f. Tester
   g. Auditer
   h. Corriger si `NON CONFORME`
   i. Réauditer
   j. Clôturer l'étape
   k. Mettre à jour l'état
4. Audit final de phase
5. Rapport de clôture
6. Arrêt

## Gates

- Chaque étape : audit obligatoire avant clôture
- Phase : audit final obligatoire
- Arrêt obligatoire après clôture — pas de lancement de la phase suivante

## Livrables

- Étapes clôturées dans `PLANS.md`
- État mis à jour dans `.agents/state/`
- Rapport de clôture de phase
- `HANDOFF.md` mis à jour

## Tests

Selon le type d'étapes de la phase

## Audits

- Un audit par étape
- Un audit final de phase

## Rollback

- Par étape selon le playbook spécifique

## Conditions de sortie

- Toutes les étapes de la phase terminées et auditées
- Rapport de clôture produit
- Statut `PHASE_CLÔTURÉE_EN_ATTENTE_DU_GO_HUMAIN`
