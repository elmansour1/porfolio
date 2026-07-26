# Playbook : Livraison de fonctionnalité

## Usage

Livrer une fonctionnalité complète en vertical slice : besoin, interface, API, métier, données, permissions, tests, documentation.

## Exclusions

- Fonctionnalités hors périmètre autorisé
- Refonte non demandée

## Préconditions

- Fonctionnalité définie dans `PLANS.md` avec critères d'acceptation
- Phase d'implémentation autorisée
- Spécification produit et UX disponibles

## Agents

Product, Métier, UX/UI, Architecte, Frontend, Backend, Database, Security, QA, Reviewer Code, Reviewer UX/UI

## Étapes

1. Valider le besoin (Product)
2. Valider les règles métier (Métier)
3. Valider la conception UX/UI
4. Valider l'architecture technique
5. Implémenter backend (API, métier, données)
6. Implémenter frontend (composants, intégration API)
7. Implémenter permissions et sécurité
8. Écrire et exécuter les tests
9. Audit code (Reviewer Code)
10. Audit UX/UI (Reviewer UX/UI)
11. Audit sécurité
12. Corriger les non-conformités
13. Réauditer
14. Mettre à jour la documentation
15. Clôturer

## Gates

- Gate frontend senior (si applicable)
- Gate backend senior (si applicable)
- Gate sécurité
- Revues indépendantes obligatoires

## Livrables

- Code implémenté et testé
- Documentation mise à jour
- Rapport d'implémentation
- Rapports d'audit

## Tests

- Unitaires, intégration, API
- Tests frontend (composants, services, formulaires)
- Tests de permissions
- Tests E2E pour parcours critiques

## Audits

- Code review indépendant
- UX/UI review indépendant
- Audit sécurité
- Audit QA

## Rollback

- Revert des commits de la fonctionnalité (sur demande explicite)
- Rollback des migrations si applicable

## Conditions de sortie

- Critères d'acceptation vérifiés
- Tous les audits `CONFORME` ou `CONFORME AVEC RÉSERVES`
- Documentation à jour
