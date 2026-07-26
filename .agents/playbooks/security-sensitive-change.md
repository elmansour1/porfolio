# Playbook : Changement sensible sécurité

## Usage

Modifier l'authentification, l'autorisation, la gestion des secrets ou tout élément à impact sécurité.

## Exclusions

- Changements cosmétiques sans impact sécurité
- Modifications frontend seules (la sécurité est côté serveur)

## Préconditions

- Besoin sécurité identifié
- Modèle de menaces à jour (`docs/security/threat-model.md`)
- `GO` explicite (changement sensible)

## Agents

Security (lead), Backend, Frontend (si impact affichage), Architecte, QA

## Étapes

1. Analyser l'impact sécurité
2. Mettre à jour le modèle de menaces si nécessaire
3. Concevoir la solution (moindre privilège)
4. Rédiger ADR si structurant
5. Implémenter côté serveur en priorité
6. Adapter le frontend si nécessaire
7. Tests de sécurité (permissions, authentification, injection)
8. Audit sécurité complet
9. Corriger les vulnérabilités identifiées
10. Réauditer
11. Mettre à jour `docs/security/`
12. Clôturer

## Gates

- L'Agent Security peut bloquer la clôture
- Aucune vulnérabilité critique non corrigée
- Checklist sécurité complète

## Livrables

- Code sécurisé
- `docs/security/` mis à jour
- Tests de sécurité
- Rapport d'audit sécurité

## Tests

- Tests d'authentification
- Tests d'autorisation (chaque rôle/permission)
- Tests d'injection
- Tests de gestion de session/jetons

## Audits

- Audit sécurité complet (`.agents/checklists/security-quality.md`)
- Code review

## Rollback

- Revert des modifications
- Révocation des jetons/clés si nécessaire

## Conditions de sortie

- Aucune vulnérabilité critique
- Audit sécurité `CONFORME`
- Documentation sécurité à jour
