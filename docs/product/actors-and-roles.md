# Acteurs et rôles

## Statut

Validé en Phase 1 — Cadrage produit.

## Acteurs

| Acteur | Description | Objectifs |
|--------|-------------|-----------|
| Visiteur public | Recruteur, RH, responsable technique, client potentiel, partenaire ou membre du réseau | Comprendre le profil, consulter compétences/expériences/projets, télécharger le CV, contacter le propriétaire |
| Administrateur | Propriétaire du portfolio, compte unique dans le MVP | Gérer le contenu, les médias, les messages, le SEO, la publication et l'ordre d'affichage |
| Moteur de recherche | Acteur technique indirect | Indexer des pages, métadonnées, URLs propres, sitemap, robots.txt et données structurées pertinentes |
| Service externe | E-mail, analytics, GitHub, LinkedIn, hébergement, stockage médias, anti-spam | Fournir des capacités techniques à décider pendant l'architecture |

## Personas de cadrage

| Persona | Besoin dominant | Ce que le produit doit rendre évident |
|---------|-----------------|---------------------------------------|
| Recruteur pressé | Qualifier rapidement le profil | Titre, disponibilité, CV, expériences, contact |
| Responsable technique | Évaluer la crédibilité technique | Projets détaillés, rôle, architecture, technologies, décisions |
| Client potentiel | Comprendre les services et la fiabilité | Services, méthode de travail, preuves, contact |
| Administrateur propriétaire | Mettre à jour sans coder | Formulaires clairs, statuts, prévisualisation, publication |

## Permissions métier

### Visiteur public

- Consulter les contenus publiés uniquement.
- Consulter les projets publiés et leurs pages de détail.
- Envoyer un message via le formulaire de contact.
- Télécharger le CV si activé.
- Accéder aux liens professionnels publiés.

### Administrateur

- Se connecter et se déconnecter.
- Gérer profil, sections, compétences, expériences, formations, projets, services, témoignages, médias, SEO, paramètres et messages.
- Publier, dépublier, archiver et ordonner les contenus.
- Prévisualiser les modifications.
- Consulter le journal d'activité sensible.

### Restrictions

- Aucun utilisateur public ne peut accéder à l'administration.
- Il n'existe pas d'inscription publique dans le MVP.
- Les autorisations doivent être vérifiées côté backend.
- Les moteurs de recherche ne doivent indexer que le contenu public autorisé.

## Contraintes de rôles MVP

- Un seul administrateur.
- Pas de rôles éditeur/reviewer.
- Pas d'espace visiteur connecté.
- Pas d'inscription publique.

## Dernière mise à jour

2026-07-21
