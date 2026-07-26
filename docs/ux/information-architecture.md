# Architecture d'information UX

## Statut

Validé en Phase 3 — Conception UX/UI du portfolio.

## Objectif

Structurer le site public et l'administration pour que les visiteurs comprennent rapidement le profil, que les projets prouvent la compétence, et que l'administrateur puisse maintenir le contenu sans friction.

## Principes de navigation

- Une navigation publique courte, ancrée sur les sections principales.
- Un CTA principal constant vers le contact.
- Un CTA secondaire vers projets, CV ou GitHub selon le contexte.
- Une administration organisée par domaines métier, pas par tables techniques.
- Les statuts de publication visibles partout où ils influencent la visibilité publique.

## Site public

### Navigation principale

1. Accueil
2. À propos
3. Compétences
4. Expériences
5. Projets
6. Services
7. Contact

### Ordre de lecture recommandé

1. Hero : identité, proposition de valeur, CTA.
2. Crédibilité factuelle : technologies, disponibilité, indicateurs réels.
3. À propos court : positionnement et manière de travailler.
4. Compétences : catégories et descriptions qualitatives.
5. Projets mis en avant : preuves concrètes.
6. Expériences : chronologie ou ordre éditorial.
7. Services : offres réellement proposées.
8. Méthode : démarche professionnelle.
9. Contact : formulaire et coordonnées.

### Pages publiques

| Route | Rôle UX | Priorité |
|-------|---------|----------|
| `/` | Landing complète | MUST |
| `/projects/:slug` | Étude de cas projet | MUST |
| `/privacy` | Confidentialité | MUST |
| `/legal` | Mentions légales | MUST |
| `/404` | Erreur utile | MUST |
| `/projects` | Liste complète projets | COULD |

## Administration

### Navigation admin

1. Dashboard
2. Profil
3. Projets
4. Compétences
5. Expériences
6. Services
7. Messages
8. Médias
9. SEO
10. Paramètres

### Priorités admin

- Créer ou modifier un contenu.
- Comprendre s'il est visible publiquement.
- Corriger les traductions manquantes.
- Publier, dépublier ou archiver.
- Retrouver rapidement les messages à traiter.
- Gérer les médias sans casser le site.

## Règles de hiérarchie

- Site public : une seule action principale par section.
- Admin : action principale explicite dans chaque écran, actions destructives secondaires et confirmées.
- Les badges de statut sont toujours visibles dans listes et formulaires.
- Les contenus incomplets sont signalés sans bloquer la navigation.

## Dernière mise à jour

2026-07-21
