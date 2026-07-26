# Instructions OpenAI Codex

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
- Pas de faux résultats
- Le dépôt est la source de vérité

## Handoff

Mettre à jour `.agents/state/HANDOFF.md` à chaque clôture d'étape.

## Détail complet

Voir `AGENTS.md` et `.agents/`.
