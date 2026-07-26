# GitHub Copilot Instructions

## Point d'entrée

Lire `AGENTS.md` à la racine du dépôt. C'est la source de vérité universelle pour ce projet.

## Contexte projet

Ce dépôt utilise un framework d'entreprise virtuelle d'ingénierie logicielle pilotée par IA. Avant toute modification :

1. Lire `AGENTS.md`
2. Lire `PROJECT_BRIEF.md` et `PROJECT.md`
3. Vérifier `PLANS.md` pour le périmètre autorisé
4. Vérifier `.agents/state/HUMAN_GATES.md` pour le `GO` humain

## Règles de code

- Code senior : lisibilité, simplicité, testabilité, sécurité
- Frontend : Angular standalone, TypeScript strict, Tailwind + PrimeNG + SCSS
- Backend : Java 21, Spring Boot, contrôleurs minces, DTO, validation serveur
- Pas de modification hors périmètre autorisé
- Pas de commit sans demande explicite

## Handoff

Mettre à jour `.agents/state/HANDOFF.md` si tu termines une session de travail.

## Détail complet

Voir `AGENTS.md` et `.agents/` pour les agents, playbooks, templates et checklists.
