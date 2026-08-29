# PLANS

## Légende des états

`BACKLOG` | `READY` | `AUTHORIZED` | `IN_PROGRESS` | `BLOCKED` | `IN_REVIEW` | `DONE` | `CANCELLED`

---

## Phase 0 — Initialisation et audit

**Objectif :** Installer le framework d'entreprise virtuelle, détecter le mode, initialiser l'état.

**État :** `DONE`
**Autorisation :** `INITIALISATION_DU_FRAMEWORK` (2026-07-21, ré-audit 2026-08-29)
**Date de clôture :** 2026-07-21 (ré-audit : 2026-08-29)

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 0.1 | Inspection du dépôt | Orchestrateur | DONE | CONFORME |
| 0.2 | Installation du framework | Orchestrateur, Documentation | DONE | CONFORME |
| 0.3 | Initialisation fichiers projet | Orchestrateur, Documentation | DONE | CONFORME |
| 0.4 | Création template exportable | Orchestrateur | DONE | CONFORME |
| 0.5 | Audit final d'initialisation | Orchestrateur, Reviewer Code | DONE | CONFORME |
| 0.6 | Ré-audit projet existant et resynchronisation état | Orchestrateur, Documentation | DONE | CONFORME AVEC RÉSERVES |

---

## Phase 1 — Cadrage produit

**Objectif :** Vision produit, MVP, acteurs, parcours, exigences.

**État :** `DONE`
**Autorisation :** `GO pour la phase 1` (2026-07-21)
**Date de clôture :** 2026-07-21

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 1.1 | Analyse de l'idée et du brief | Product | DONE | CONFORME |
| 1.2 | Identification problème et acteurs | Product, Métier | DONE | CONFORME |
| 1.3 | MVP et exclusions | Product | DONE | CONFORME AVEC RÉSERVES |
| 1.4 | Parcours utilisateur | Product, UX/UI | DONE | CONFORME AVEC RÉSERVES |
| 1.5 | Exigences fonctionnelles et NFR | Product, Métier | DONE | CONFORME AVEC RÉSERVES |
| 1.6 | Hypothèses et risques | Product | DONE | CONFORME |
| 1.7 | Audit final de phase | Orchestrateur | DONE | CONFORME AVEC RÉSERVES |

**Réserve :** Contenu produit dans `docs/product/*` à resynchroniser depuis `.agents/state/PHASE_1_REPORT.md`.

---

## Phase 2 — Architecture et conception

**Objectif :** Architecture, modules, contrats, sécurité, UX/UI, ADR.

**État :** `DONE`
**Autorisation :** `GO pour la phase 2` (2026-07-21)
**Date de clôture :** 2026-07-21

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 2.1 | Architecture globale | Architecte | DONE | CONFORME |
| 2.2 | Modèle de données | Database, Architecte | DONE | CONFORME |
| 2.3 | Contrats API | Backend, Architecte | DONE | CONFORME |
| 2.4 | Architecture frontend | Frontend, Architecte | DONE | CONFORME |
| 2.5 | Conception UX/UI | UX/UI | DONE | CONFORME AVEC RÉSERVES |
| 2.6 | Sécurité et menaces | Security | DONE | CONFORME |
| 2.7 | Stratégie de test | QA | DONE | CONFORME AVEC RÉSERVES |
| 2.8 | Infrastructure | DevOps/SRE | DONE | CONFORME |
| 2.9 | ADR structurants | Architecte | DONE | CONFORME |
| 2.10 | Audit final de phase | Orchestrateur | DONE | CONFORME AVEC RÉSERVES |

**ADR acceptés :** ADR-0001 à ADR-0010 (+ ADR-0011 à ADR-0013 en implémentation).

---

## Phase 3 — Conception UX/UI

**Objectif :** Conception complète site public et admin (sans implémentation).

**État :** `DONE`
**Autorisation :** `GO pour la phase 3` (2026-07-21)
**Date de clôture :** 2026-07-21

---

## Phase 4 — Fondations techniques

**Objectif :** Bootstrap backend, frontend, Docker, tests de démarrage.

**État :** `DONE`
**Autorisation :** `GO pour la phase 4` (2026-07-21)
**Date de clôture :** 2026-07-21

---

## Phase 5 — Implémentation incrémentale (vertical slices)

**Objectif :** Livrer les fonctionnalités MVP par slices verticales.

**État :** `DONE` (sous-phase 5.9 clôturée le 2026-08-29)
**Autorisation :** GOs par sous-phase (2026-07-21 à 2026-08-29)

| ID | Titre | État | Audit | Date clôture |
|----|-------|------|-------|--------------|
| 5.1 | Authentification administrateur | DONE | CONFORME AVEC RÉSERVES | 2026-07-21 |
| 5.2 | Layout et dashboard admin | DONE | CONFORME AVEC RÉSERVES | 2026-07-21 |
| 5.3 | Profil professionnel et paramètres site | DONE | CONFORME AVEC RÉSERVES | 2026-07-21 |
| 5.4 | Compétences (admin + public) | DONE | CONFORME AVEC RÉSERVES | 2026-07-21 |
| 5.5 | Parcours professionnel | DONE | CONFORME AVEC RÉSERVES | 2026-07-21 |
| 5.6 | Projets et études de cas | DONE | CONFORME AVEC RÉSERVES | 2026-08-02 |
| 5.7 | Services et méthode de travail | DONE | CONFORME AVEC RÉSERVES | 2026-08-03 |
| 5.8 | Landing publique finale | DONE | CONFORME AVEC RÉSERVES | 2026-08-29 |
| 5.9 | Contact public et gestion messages admin | DONE | CONFORME AVEC RÉSERVES | 2026-08-29 |

**Note 5.9 :** Clôturée le 2026-08-29 — formulaire public, admin messages, pages légales, tests et documentation API contact.

---

## Phase 6 — Stabilisation

**Objectif :** Régressions, sécurité, documentation, isolation data-access public, inspection visuelle. Pas de nouvelle fonctionnalité métier.

**État :** `DONE`
**Autorisation :** `Exécute la phase 6 jusqu'à sa clôture` (2026-08-29)
**Date de clôture :** 2026-08-29
**Exclusions :** Déploiement production, Playwright complet, bump de budget bundle, Phase 7

| ID | Titre | Agents | État | Audit |
|----|-------|--------|------|-------|
| 6.1 | Enregistrement du GO et cadrage | Orchestrateur | DONE | CONFORME |
| 6.2 | Suite de régression backend/frontend | QA, Backend, Frontend | DONE | CONFORME |
| 6.3 | Durcissement sécurité contact | Security, Backend | DONE | CONFORME |
| 6.4 | Isolation data-access public (TD-016) | Frontend, Architecte | DONE | CONFORME |
| 6.5 | Resynchronisation documentation (TD-018) | Documentation | DONE | CONFORME |
| 6.6 | Inspection visuelle landing/contact | UX/UI, Frontend | DONE | CONFORME AVEC RÉSERVES |
| 6.7 | Audit final de phase | Orchestrateur, Reviewer Code | DONE | CONFORME AVEC RÉSERVES |

**Réserves :** Contenu réel publié et admin authentifié non inspectés ; budget bundle et Playwright reportés ; pages légales à compléter avant prod.

---

## Phase 7 — Livraison

**État :** `BACKLOG` — Dépend de Phase 6

## Phase 8 — Exploitation et évolution

**État :** `BACKLOG` — Dépend de Phase 7

---

## Dernière mise à jour

2026-08-29
