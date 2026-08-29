# Benchmark — Structure des portfolios professionnels (2025–2026)

## Statut

Validé — recadrage produit du 2026-08-29.

## Sources analysées

- ShowProof — checklist portfolio développeur 2026
- DesignToCodes — 12 exemples portfolios professionnels
- MySeera — template développeur senior
- Roadmap.sh — structure templates frontend
- Popout — guide portfolio développeur 2026
- Références qualitatives SaaS : Linear, Stripe, Vercel (hiérarchie, densité, preuve produit)

## Synthèse du marché

Un portfolio efficace en 2026 **prouve avant de promettre** :

1. **10 secondes** — qui vous êtes, pour qui, disponibilité
2. **30 secondes** — une étude de cas convaincante
3. **2 minutes** — parcours, stack groupée, contact immédiat

Les portfolios premium (Linear / Stripe / Vercel) partagent :

- hiérarchie typographique forte, espacement généreux ;
- une seule couleur d'accent ;
- surfaces en couches (fond → carte → élévation) ;
- preuves concrètes (projets, métriques, démos) avant listes de compétences ;
- contact visible en header et footer ;
- compétences **groupées par usage**, jamais en mur d'icônes.

## Structure retenue pour ce produit

Alignement **développeur / ingénieur full-stack** avec dimension **services freelance** :

| Ordre | Section | Priorité marché | Rôle |
|-------|---------|-----------------|------|
| 1 | Hero | MUST | Identité, titre métier, disponibilité, CTA projets + contact |
| 2 | Indicateurs | SHOULD | Métriques réelles (années, projets, etc.) |
| 3 | À propos | MUST | 2 paragraphes max — positionnement, contexte humain |
| 4 | Projets / études de cas | MUST | 3–5 preuves — problème, rôle, résultat, lien détail |
| 5 | Compétences | SHOULD | Catégories par usage (frontend, backend, infra…) + niveaux |
| 6 | Parcours | SHOULD | Expériences, formations, certifications |
| 7 | Services | SHOULD* | Offres proposées (* pertinent pour freelance/consultant) |
| 8 | Méthode | COULD | Différenciateur crédible |
| 9 | Contact | MUST | Formulaire + coordonnées + liens professionnels |

**Ordre clé vs ancienne version :** les **projets passent avant les compétences** (preuve avant affirmation).

## Navigation publique cible

1. À propos
2. Projets
3. Compétences
4. Parcours
5. Services (si publiés)
6. Méthode (si publiée)
7. Contact (CTA header)

Route `/projects` pour la liste complète ; ancres `#projects`, `#skills`, etc. sur la landing.

## Format étude de cas (CASE)

Chaque projet détaillé doit viser :

- **C**hallenge — problème et contexte
- **A**pproach — rôle et décisions clés
- **S**olution — architecture / livrable
- **E**ffect — métrique ou impact mesurable

Champs backend déjà prévus : `problem`, `role`, `solution`, `results` dans les traductions projet.

## Compétences — règles UX

- Maximum **4 catégories** visibles simultanément sur la landing
- **Stack principale** (featured) en bandeau compact, pas en chips redondantes
- Niveaux traduits visuellement (barre de maîtrise), pas seulement en texte
- `usageSummary` affiché quand disponible
- Pas de mur de 30 technologies

## Exclusions délibérées (MVP)

- Témoignages fictifs
- Blog complet
- Section « Now » automatique (peut être ajoutée en COULD via profil)
- Mur GitHub temps réel (hors scope MVP)

## Implications frontend premium

- Hero sombre avec dégradé mesh discret (réf. Stripe)
- Typographie display serrée, Inter / stack système
- Grille bento pour compétences et cartes projet
- États complets : chargement, vide, erreur partielle, section masquée
- Contact sans friction — formulaire + liens directs

## Dernière mise à jour

2026-08-29
