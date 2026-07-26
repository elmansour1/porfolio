# Playbook : Frontend premium

## Usage

Implémenter ou auditer une interface frontend selon les standards SaaS premium et code senior.

## Exclusions

- Modifications backend non coordonnées
- Changements de contrat API sans validation

## Préconditions

- Spécifications UX/UI validées
- Architecture frontend définie
- `GO` pour l'implémentation frontend

## Agents

UX/UI, Frontend (lead), Architecte, Reviewer UX/UI, Reviewer Code, QA

## Étapes

1. Analyse produit (validation du besoin)
2. Analyse UX/UI (conception validée)
3. Conception technique frontend
4. Validation architecture frontend
5. Implémentation senior
6. Build
7. Lint
8. Tests
9. Inspection visuelle (si environnement disponible)
10. Audit UX/UI
11. Audit accessibilité
12. Audit performance
13. Audit QA
14. Code review
15. Corrections
16. Réaudit
17. Clôture

## Gates

Gate frontend complet (voir `AGENTS.md` section 20) :

```
Product Validation           : PASS | FAIL
UX/UI Design Validation      : PASS | FAIL
Frontend Architecture        : PASS | FAIL
TypeScript Strictness        : PASS | FAIL
Component Quality            : PASS | FAIL
State Management             : PASS | FAIL
API Integration              : PASS | FAIL
Error Handling               : PASS | FAIL
Security Review              : PASS | FAIL
Performance Review           : PASS | FAIL
Accessibility                : PASS | FAIL
Responsive                   : PASS | FAIL
Internationalization         : PASS | FAIL | NOT APPLICABLE
Tests                        : PASS | FAIL
Build                        : PASS | FAIL | NOT EXECUTED
Lint                         : PASS | FAIL | NOT EXECUTED
Visual Inspection            : PASS | FAIL | NOT EXECUTED
UX/UI Reviewer Verdict       : CONFORME | CONFORME AVEC RÉSERVES | NON CONFORME
Code Reviewer Verdict        : CONFORME | CONFORME AVEC RÉSERVES | NON CONFORME
```

## Livrables

- Code frontend conforme
- Tests frontend
- Rapports d'audit

## Tests

- Unitaires composants et services
- Tests de formulaires
- Tests de permissions d'affichage
- Build et lint

## Audits

- UX/UI review indépendant
- Code review indépendant
- Checklist frontend senior
- Checklist UX/UI premium

## Rollback

- Revert des modifications frontend

## Conditions de sortie

- Gate frontend complet : tous les contrôles critiques en PASS
- Verdicts reviewers acceptables
