# PROJECT BRIEF

## 1. Statut du projet

Valeurs possibles : `NOUVELLE_IDÉE` | `NOUVEAU_PROJET` | `PROJET_EXISTANT`

**Valeur :** `PROJET_EXISTANT`

## 2. Nom du projet

Portfolio professionnel — Faouzi El Mansour

## 3. Idée principale

Application web avec site public premium et espace d'administration sécurisé. Le produit présente profil, compétences, expériences, projets, services, coordonnées, contenus français/anglais, formulaire de contact, SEO de base et gestion de contenu administrable.

## 4. Problème à résoudre

Dispersion des informations professionnelles : recruteurs, responsables techniques et clients/partenaires peinent à obtenir une vue cohérente, crédible et à jour des compétences, réalisations et services proposés.

## 5. Utilisateurs ou acteurs connus

- Visiteur public (recruteur, responsable technique, client/partenaire)
- Administrateur unique (propriétaire du portfolio)

## 6. Fonctionnalités envisagées

- Site public multilingue (FR/EN) avec landing modulaire
- Administration sécurisée du contenu (profil, compétences, parcours, projets, services)
- Authentification administrateur avec récupération de mot de passe
- Formulaire de contact public et gestion des messages
- Médias, SEO, pages légales
- Publication, archivage, ordre et visibilité des sections

## 7. Objectif du MVP

Portfolio professionnel administrable, multilingue, sécurisé, premium, orienté preuves concrètes — publiable et exploitable par un seul administrateur.

## 8. Périmètre exclu

- Multi-admin et rôles complexes
- Blog complet, paiement, IA, CRM
- Microservices, Kubernetes, multi-tenant
- Témoignages fictifs, contenus inventés

## 9. Règles métier connues

- Un seul administrateur MVP
- Français par défaut, anglais dans le MVP
- Sections masquées si désactivées ou vides
- Pas de contenu fictif publié
- Publication explicite du contenu avant affichage public

## 10. Contraintes

### Budget

Limité — monolithe modulaire privilégié

### Délai

Non défini formellement

### Pays ou marché

Non défini — contenus FR/EN

### Contraintes légales

Pages légales (mentions, confidentialité) prévues

### Contraintes de sécurité

Authentification admin, CSRF, moindre privilège, anti-spam contact — voir ADR et `docs/security/`

## 11. Stack technique

### Frontend

- Angular 20.3+
- TypeScript strict
- Standalone, zoneless
- SSR Angular
- SCSS, Tailwind CSS, PrimeNG 20, ngx-translate

**Modifications :** SSR activé pour SEO public (ADR-0002)

### Backend

- Java 21
- Spring Boot 4.0.1
- PostgreSQL, Flyway
- API REST, Spring Security
- Docker Compose

**Modifications :** Aucune par rapport à la stack de référence

## 12. Projet existant

### État connu

Application full-stack opérationnelle en développement local. Phases 0 à 4 et sous-phases 5.1 à 5.8 clôturées. Travail contact/messages détecté non commité, sans GO enregistré pour la sous-phase 5.9.

### Fonctionnalités existantes

- Auth admin (bootstrap, login, reset, session, CSRF)
- Profil et paramètres site
- Compétences (catégories, publication, ordre)
- Parcours professionnel (expériences, formations, certifications)
- Projets et études de cas
- Services professionnels et méthode de travail
- Landing publique modulaire SSR
- Module contact/messages (en cours, non clôturé)

### Problèmes connus

- Dérive documentaire : fichiers canoniques `docs/product/*`, `PLANS.md`, état projet non synchronisés avec le code et les rapports `.agents/state/`
- Node.js système v18 insuffisant pour Angular CLI (utiliser nvm Node 20+)
- Dette technique TD-015 à TD-017 active

### Éléments à préserver

- Framework d'entreprise virtuelle (`.agents/`, `AGENTS.md`)
- Architecture modulaire par domaine backend/frontend
- ADR-0001 à ADR-0013
- Fonctionnalités opérationnelles existantes

## 13. Priorités

1. Finaliser sous-phase 5.9 (contact) avec GO humain
2. Publier contenu réel aligné structure benchmark (études de cas CASE)
3. Stabilisation et préparation livraison (Phase 6)

## 13 bis. Structure publique (recadrage 2026-08-29)

Voir `docs/product/portfolio-structure-benchmark.md` — ordre : Hero → À propos → Projets → Compétences → Parcours → Services → Méthode → Contact.

## 14. Consignes particulières

- Gates humains obligatoires entre phases et sous-phases
- Pas de commit sans demande explicite
- Inspection visuelle réelle requise avant mise en ligne

## 15. Autorisation initiale

Valeurs possibles : `AUDIT_UNIQUEMENT` | `CADRAGE_PRODUIT` | `INITIALISATION_DU_FRAMEWORK`

**Valeur :** `INITIALISATION_DU_FRAMEWORK` (ré-audit et resynchronisation — 2026-08-29)
