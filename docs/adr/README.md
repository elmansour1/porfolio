# Architecture Decision Records (ADR)

## Usage

Chaque décision structurante est documentée ici sous forme d'ADR.

## Format

Utiliser le template : `.agents/templates/adr-template.md`

## Index des ADR

| ID | Titre | Statut | Date |
|----|-------|--------|------|
| ADR-0001 | Stack et architecture globale du MVP | Accepté | 2026-07-21 |
| ADR-0002 | Stratégie de rendu public Angular | Accepté | 2026-07-21 |
| ADR-0003 | Authentification administrateur | Accepté | 2026-07-21 |
| ADR-0004 | Publication et internationalisation des contenus | Accepté | 2026-07-21 |
| ADR-0005 | Stockage et sécurité des médias | Accepté | 2026-07-21 |
| ADR-0006 | Contact, e-mail et anti-spam | Accepté | 2026-07-21 |
| ADR-0007 | Déploiement Docker Compose | Accepté | 2026-07-21 |
| ADR-0008 | Conventions API REST | Accepté | 2026-07-21 |
| ADR-0009 | Modèle de données MVP | Accepté | 2026-07-21 |
| ADR-0010 | Design system et UX/UI | Accepté | 2026-07-21 |
| ADR-0011 | Récupération du mot de passe administrateur | Accepté | 2026-07-21 |

## Décisions différées

| Sujet | Raison | Phase cible |
|-------|--------|-------------|
| Hébergeur exact | Dépend coût, disponibilité et support Docker/volumes | Phase 3 ou 6 |
| Fournisseur e-mail exact | Dépend comptes disponibles et coût | Phase 3 |
| Seuils exacts upload | À calibrer pendant implémentation médias | Phase 5 |
| Fournisseur de remise des jetons reset | Aucun fournisseur e-mail décidé en 5.1 | Phase ultérieure avant production |
| Analytics | Optionnel, dépend besoin réel et consentement | Après MVP ou GO explicite |

## Dernière mise à jour

2026-07-21
