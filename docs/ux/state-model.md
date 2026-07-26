# Modèle d'états d'interface

## Statut

Validé en Phase 3 — Conception UX/UI du portfolio.

## États publics

| État | Usage | Comportement attendu |
|------|-------|----------------------|
| Chargement | Données publiques ou projet | Skeleton sobre, pas de saut de layout majeur |
| Contenu | Données publiées disponibles | Affichage complet |
| Vide | Aucune donnée réelle publiée | Section masquée ou état utile selon contexte |
| Erreur | API indisponible ou erreur réseau | Message compréhensible, action réessayer ou contact |
| Introuvable | Slug projet absent/non publié | Page 404 cohérente |
| Langue indisponible | Traduction absente | Contenu non affiché dans la langue ; message discret si nécessaire |
| Contact succès | Message stocké | Confirmation claire |
| Contact erreur | Validation ou serveur | Erreurs champ par champ ou globale |

## États admin

| État | Usage | Comportement attendu |
|------|-------|----------------------|
| Non authentifié | Accès admin | Redirection login |
| Session expirée | Session invalide | Message clair, retour login |
| Accès refusé | Action interdite | Message sans détails sensibles |
| Chargement | Listes/formulaires | Skeleton ou indicateur localisé |
| Vide | Aucune ressource | CTA de création contextualisé |
| Brouillon | Contenu non public | Badge `DRAFT`, explication visible |
| Publié | Contenu public | Badge `PUBLISHED`, date si disponible |
| Archivé | Contenu retiré | Badge `ARCHIVED`, non public |
| Traduction manquante | Langue incomplète | Alerte non bloquante sauf publication dans cette langue |
| Sauvegarde en cours | Formulaire | Bouton loading, double soumission bloquée |
| Sauvegarde réussie | Formulaire | Feedback discret |
| Erreur validation | Formulaire | Résumé + erreurs champs |
| Erreur serveur | Formulaire/liste | Message récupérable, pas de détails techniques |
| Suppression risquée | Média utilisé | Blocage ou confirmation explicite |

## Règles de ton

- Messages courts, concrets, non techniques.
- Pas d'exposition d'erreur interne.
- Pour l'admin, indiquer la conséquence : visible publiquement, brouillon, archivé, incomplet.

## Dernière mise à jour

2026-07-21
