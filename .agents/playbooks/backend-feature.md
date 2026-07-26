# Playbook : Fonctionnalité backend

## Usage

Implémenter une fonctionnalité backend complète : API, métier, persistance, sécurité, tests.

## Exclusions

- Modifications frontend non coordonnées
- Changements de schéma non validés

## Préconditions

- Spécification et règles métier validées
- Architecture backend définie
- `GO` pour l'implémentation backend

## Agents

Métier, Architecte, Backend (lead), Database, Security, Reviewer Code, QA

## Étapes

1. Analyse produit/métier
2. Analyse architecture
3. Analyse database
4. Analyse sécurité
5. Conception API (DTO, validation, codes HTTP)
6. Validation technique
7. Implémentation senior
8. Migrations
9. Tests unitaires
10. Tests d'intégration
11. Tests API
12. Tests sécurité
13. Audit code
14. Audit database
15. Audit sécurité
16. Corrections
17. Réaudit
18. Clôture

## Gates

Gate backend (voir `AGENTS.md` section 22) :

```
Business Compliance          : PASS | FAIL
Architecture Compliance      : PASS | FAIL
API Contract                 : PASS | FAIL
Code Readability             : PASS | FAIL
Separation of Concerns       : PASS | FAIL
Transactions                 : PASS | FAIL
Validation                   : PASS | FAIL
Error Handling               : PASS | FAIL
Security                     : PASS | FAIL
Database Integrity           : PASS | FAIL
Performance                  : PASS | FAIL
Unit Tests                   : PASS | FAIL
Integration Tests            : PASS | FAIL
API Tests                    : PASS | FAIL
Migrations                   : PASS | FAIL | NOT APPLICABLE
Build                        : PASS | FAIL | NOT EXECUTED
Reviewer Verdict             : CONFORME | CONFORME AVEC RÉSERVES | NON CONFORME
```

## Livrables

- Code backend conforme
- Migrations
- Tests
- Documentation API
- Rapports d'audit

## Tests

- Unitaires (règles métier)
- Intégration (persistance, transactions)
- API (contrats, codes HTTP, erreurs)
- Sécurité (permissions)

## Audits

- Code review indépendant
- Audit database
- Audit sécurité
- Checklist backend senior

## Rollback

- Revert des modifications backend
- Rollback des migrations

## Conditions de sortie

- Gate backend complet : tous les contrôles critiques en PASS
- Verdict reviewer acceptable
