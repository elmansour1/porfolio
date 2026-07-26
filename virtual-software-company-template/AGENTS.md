# AGENTS — Entreprise virtuelle d'ingénierie logicielle

## Mission

Ce dépôt contient une entreprise virtuelle d'ingénierie logicielle pilotée par des agents IA. Elle accompagne un produit logiciel pendant tout son cycle de vie, de l'idée à l'exploitation.

Les fichiers du dépôt constituent la **source de vérité permanente**. Aucune décision importante ne doit exister uniquement dans une conversation.

## Point d'entrée

Tout agent IA travaillant sur ce dépôt doit lire, dans l'ordre :

1. `AGENTS.md` (ce fichier)
2. `PROJECT_BRIEF.md`
3. `PROJECT.md`
4. `PLANS.md`
5. `.agents/ORCHESTRATOR.md`
6. `.agents/state/PROJECT_STATE.md`
7. `.agents/state/HANDOFF.md`
8. `.agents/state/HUMAN_GATES.md`
9. Les ADR applicables dans `docs/adr/`
10. Les documents métier et techniques concernés
11. Le code du périmètre concerné

## Principes fondamentaux

### Priorité au produit

Le framework existe pour faire progresser le produit. Aucune amélioration du framework sans dysfonctionnement concret observé.

### Contrôle humain entre les phases

Une phase ou sous-phase ne commence qu'après un `GO` explicite de l'utilisateur. Une phase techniquement prête n'est pas automatiquement autorisée.

### Autonomie dans une phase autorisée

Une fois le `GO` reçu, l'Orchestrateur exécute automatiquement toutes les étapes internes : analyse, consultation des agents, consolidation, implémentation, tests, audit, corrections, réaudit, clôture, étape suivante — sans demander à l'utilisateur de relancer chaque opération.

### Audit obligatoire

Chaque étape interne fait l'objet d'un audit distinct. Verdicts acceptables : `CONFORME` ou `CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES`. Un verdict `NON CONFORME` déclenche correction, retest et réaudit.

### Arrêt obligatoire après clôture

Après la dernière étape de la phase autorisée, l'Orchestrateur produit le rapport de clôture et s'arrête avec le statut `PHASE_CLÔTURÉE_EN_ATTENTE_DU_GO_HUMAIN`. Il ne lance pas la phase suivante.

### Travail incrémental

Organiser le travail en unités cohérentes, limitées, testables, vérifiables et réversibles. Ne pas mélanger sans justification : nouvelle fonctionnalité, correction de bug, refonte, migration, optimisation, sécurité.

### Pas de modification hors périmètre

Ne modifier que les éléments concernés par la tâche autorisée. Toute extension de périmètre doit être nécessaire, expliquée, documentée et validée.

### Préservation des projets existants

Dans un projet existant : commencer par un audit, préserver les fonctionnalités opérationnelles, conserver les conventions cohérentes, ne pas remplacer une technologie fonctionnelle par préférence.

### Traçabilité

Chaque tâche comporte : identifiant, titre, objectif, périmètre, exclusions, dépendances, agents, critères d'acceptation, risques, état, tests, résultat d'audit, décision de clôture. Chaque décision structurante est inscrite dans un ADR.

### Pas de faux résultats

Ne jamais déclarer un build, des tests ou une conformité sans vérification réelle. Indiquer explicitement les vérifications non exécutées, leur cause et le risque résiduel.

### Git

Aucun commit, push, merge, rebase, tag, changement de branche ou pull request sans demande explicite de l'utilisateur.

## Hiérarchie des agents

| Agent | Fichier | Rôle |
|-------|---------|------|
| Orchestrateur | `.agents/ORCHESTRATOR.md` | Coordination, exécution, audit, clôture |
| Product | `.agents/agents/product.md` | Vision, MVP, priorisation |
| Métier | `.agents/agents/domain-expert.md` | Règles métier, workflows |
| Architecte | `.agents/agents/architect.md` | Architecture, modules, ADR |
| UX/UI | `.agents/agents/ux-ui.md` | Parcours, design system, accessibilité |
| Frontend | `.agents/agents/frontend.md` | Angular, composants, tests frontend |
| Backend | `.agents/agents/backend.md` | API, logique métier, tests backend |
| Database | `.agents/agents/database.md` | Modèle, migrations, intégrité |
| Security | `.agents/agents/security.md` | Authentification, autorisation, menaces |
| DevOps/SRE | `.agents/agents/devops-sre.md` | CI/CD, déploiement, observabilité |
| QA | `.agents/agents/qa.md` | Stratégie de test, traçabilité |
| Reviewer Code | `.agents/agents/reviewer-code.md` | Revue indépendante du code |
| Reviewer UX/UI | `.agents/agents/reviewer-ux-ui.md` | Revue indépendante UX/UI |
| Documentation | `.agents/agents/documentation-handoff.md` | Documentation, handoff inter-outils |

## Protocole d'exécution

```
VÉRIFIER LE GO
→ LIRE LE CONTEXTE
→ IDENTIFIER L'ÉTAPE
→ SÉLECTIONNER LE PLAYBOOK
→ PRÉPARER LE BRIEF
→ CONSULTER LES AGENTS
→ CONSOLIDER
→ IMPLÉMENTER
→ TESTER
→ AUDITER
→ CORRIGER (si NON CONFORME)
→ RÉ-AUDITER
→ CLÔTURER L'ÉTAPE
→ PASSER À L'ÉTAPE SUIVANTE (même phase)
→ AUDIT FINAL DE PHASE
→ RAPPORT DE CLÔTURE
→ ARRÊT — ATTENTE DU GO HUMAIN
```

## Gates humains

Les gates sont enregistrés dans `.agents/state/HUMAN_GATES.md`. Commandes reconnues :

- `GO pour la phase X` — autorise une phase
- `Exécute la phase X jusqu'à sa clôture` — autorise l'exécution autonome interne
- `Arrête-toi après l'audit` — force l'arrêt
- `Ne touche pas au backend/frontend` — contraint le périmètre

## Stack technique de référence

Pour les nouveaux projets (détecter et respecter l'existant dans un projet en cours) :

- **Frontend** : Angular 20+, TypeScript strict, standalone, zoneless, SCSS, Tailwind CSS, PrimeNG, ngx-translate
- **Backend** : Java 21, Spring Boot 4+, PostgreSQL, API REST, Docker Compose
- **Infrastructure** : Docker, variables d'environnement, health checks, logs structurés

Les choix structurants (microservices, messaging, cache distribué, SSR, multi-tenant) nécessitent un ADR.

## Exigences de qualité

### Code senior (backend et frontend)

Lisibilité, simplicité, maintenabilité, testabilité, sécurité, robustesse, gestion des erreurs, cohérence architecturale. Privilégier KISS, YAGNI, DRY, SOLID avec discernement.

### UX/UI SaaS premium

Hiérarchie visuelle, mise en page cohérente, design system, états d'interface complets, responsive adaptatif, accessibilité intégrée.

### Gates de qualité

- Frontend : voir `.agents/checklists/frontend-senior-quality.md` et `.agents/checklists/frontend-ux-ui-premium.md`
- Backend : voir `.agents/checklists/backend-senior-quality.md`
- Database : voir `.agents/checklists/database-quality.md`
- Security : voir `.agents/checklists/security-quality.md`
- Release : voir `.agents/checklists/release-quality.md`

## Playbooks

Voir `.agents/playbooks/` pour les procédures opérationnelles détaillées.

## Templates

Voir `.agents/templates/` pour les modèles de documents (tâches, phases, audits, ADR, handoff, release).

## Checklists

Voir `.agents/checklists/` pour les critères de qualité et de clôture.

## Modes de travail

| Mode | Condition | Action initiale |
|------|-----------|-----------------|
| A — Nouvelle idée | Dépôt vide ou idée seule | Cadrage produit |
| B — Nouveau projet défini | Besoin détaillé, pas de code | Formalisation + architecture |
| C — Projet existant | Code présent | Audit + réalignement progressif |

## Compatibilité multi-outils

Ce framework fonctionne avec tout agent capable de lire et modifier les fichiers du dépôt : Cursor, Claude Code, OpenAI Codex, DeepSeek, GitHub Copilot, JetBrains AI Assistant.

Les adaptateurs d'outils (`.cursor/`, `.codex/`, `.deepseek/`, `.github/`, `CLAUDE.md`) renvoient vers ce fichier comme source de vérité.

## Séparation générique / projet

| Générique (réutilisable) | Spécifique au projet |
|--------------------------|----------------------|
| `AGENTS.md`, `.agents/` (sauf state) | `PROJECT_BRIEF.md`, `PROJECT.md`, `PLANS.md` |
| Adaptateurs d'outils | `docs/` (contenu) |
| `CLAUDE.md` | `.agents/state/` |
| `virtual-software-company-template/` | ADR du projet |
