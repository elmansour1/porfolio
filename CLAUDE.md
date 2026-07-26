# Instructions Claude Code

## Point d'entrée

Lire `AGENTS.md` à la racine du dépôt. C'est la source de vérité universelle.

## Fichiers obligatoires

1. `AGENTS.md`
2. `PROJECT_BRIEF.md`
3. `PROJECT.md`
4. `PLANS.md`
5. `.agents/ORCHESTRATOR.md`
6. `.agents/state/PROJECT_STATE.md`
7. `.agents/state/HANDOFF.md`
8. `.agents/state/HUMAN_GATES.md`

## Règles essentielles

- Aucune phase sans `GO` humain explicite
- Autonomie complète à l'intérieur d'une phase autorisée
- Audit obligatoire après chaque étape
- Arrêt obligatoire après clôture de phase
- Pas de commit sans demande explicite
- Pas de faux résultats (tests, builds, conformité)
- Le dépôt est la source de vérité, pas la conversation

## Handoff

Mettre à jour `.agents/state/HANDOFF.md` à chaque clôture d'étape pour permettre la reprise par un autre outil.

## Détail complet

Voir `AGENTS.md` et `.agents/` pour l'ensemble des règles, agents, playbooks et checklists.
