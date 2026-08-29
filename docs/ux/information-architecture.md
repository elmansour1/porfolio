# Architecture d'information UX

## Statut

Recadré le 2026-08-29 — aligné benchmark portfolios 2026.

## Objectif

Le visiteur comprend en **10 s** qui vous êtes, en **30 s** une preuve concrète (projet), en **2 min** stack + parcours + contact.

## Principes

- **Preuve avant compétences** — projets avant stack
- Navigation courte, ancrée, contact toujours visible
- Une action principale par section
- Sections masquées si vides ou désactivées admin
- Admin organisé par domaine métier

## Site public — ordre de lecture

1. **Hero** — nom, titre, disponibilité, CTA projets + contact
2. **Indicateurs** — statistiques publiées (optionnel)
3. **À propos** — positionnement court (2 paragraphes max)
4. **Projets** — 3–5 études de cas mises en avant → `/projects/:slug`
5. **Compétences** — stack principale + catégories par usage
6. **Parcours** — expériences, formations, certifications
7. **Services** — offres (freelance/consultant)
8. **Méthode** — étapes de collaboration
9. **Contact** — formulaire + coordonnées + liens

## Navigation header

| Item | Cible | Condition |
|------|-------|-----------|
| À propos | `#about` | profil publié |
| Projets | `#projects` | projets featured |
| Compétences | `#skills` | catalogue non vide |
| Parcours | `#career` | expériences ou formations |
| Services | `#services` | services publiés |
| Méthode | `#method` | étapes publiées |
| Contact | `#contact` | section contact active |

Liste complète projets : `/projects` (lien secondaire dans section projets).

## Pages publiques

| Route | Rôle | Priorité |
|-------|------|----------|
| `/` | Landing modulaire | MUST |
| `/projects` | Catalogue projets | MUST |
| `/projects/:slug` | Étude de cas CASE | MUST |
| `/privacy` | Confidentialité | MUST |
| `/legal` | Mentions légales | MUST |
| `/404` | Erreur utile | MUST |

## Administration

Inchangée — dashboard, profil, projets, compétences, parcours, services, messages, médias, SEO, paramètres.

## Dernière mise à jour

2026-08-29
