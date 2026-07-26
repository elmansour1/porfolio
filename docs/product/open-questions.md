# Questions ouvertes

## Statut

Mis à jour en Phase 2. Les questions de cadrage ont été traitées par ADR ou différées explicitement.

| ID | Question | Décision / statut | Référence |
|----|----------|-------------------|-----------|
| OQ-001 | Quelle stratégie appliquer si une traduction anglaise manque ? | Résolu : contenu public visible dans une langue seulement si traduction complète/publiable | ADR-0004 |
| OQ-002 | Simple statut ou modèle brouillon/version publiée séparé ? | Résolu : statut simple `DRAFT/PUBLISHED/ARCHIVED` pour MVP | ADR-0004 |
| OQ-003 | Ressources supprimables, archivables ou bloquées si utilisées ? | Partiellement résolu : médias utilisés protégés ; politique fine à détailler en Phase 3 | ADR-0005 |
| OQ-004 | Formats, tailles et dimensions médias ? | Partiellement résolu : formats whitelistés ; seuils exacts à fixer en Phase 3 | ADR-0005 |
| OQ-005 | Durée de conservation des messages ? | Différé avant release ; doit être défini avec la politique de confidentialité | NFR-005 |
| OQ-006 | Critères projet confidentiel publiable ? | Différé en règles admin Phase 3/4 ; confidentialité reste contrainte bloquante | `docs/security/threat-model.md` |
| OQ-007 | Format qualitatif pour les compétences ? | Résolu produit : qualitatif, sans pourcentage ; libellés exacts à concevoir UX | ADR-0010 |
| OQ-008 | Tri expériences chronologique ou manuel ? | Résolu conception : ordre manuel prioritaire si renseigné, sinon tri récent | `docs/architecture/data-model.md` |
| OQ-009 | Création premier administrateur ? | Résolu : commande serveur contrôlée et idempotente | ADR-0003 |
| OQ-010 | Récupération mot de passe automatisée ? | Résolu MVP : procédure manuelle sécurisée, automatisation différée | ADR-0003 |
| OQ-011 | Stratégie SEO Angular ? | Résolu : SSR routes publiques dynamiques, prérendu possible pages statiques | ADR-0002 |
| OQ-012 | Fournisseur e-mail et anti-spam ? | Partiellement résolu : SMTP env + honeypot/rate limit ; fournisseur exact différé | ADR-0006 |

## Questions restant à préciser avant livraison

- Durée de conservation des messages.
- Seuils exacts d'upload, session, rate limiting et performance.
- Hébergeur exact.
- Fournisseur e-mail exact.
- Contenus réels et critères de confidentialité projet.

## Dernière mise à jour

2026-07-21
