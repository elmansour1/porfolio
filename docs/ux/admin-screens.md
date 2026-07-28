# Spécification des écrans d'administration

## Statut

Validé en Phase 3 — Conception UX/UI du portfolio. Layout/dashboard implémentés en 5.2 ; profil et paramètres implémentés en 5.3 ; compétences et catégories implémentées en 5.4.

## Principes admin

- L'administration est un outil de travail professionnel, pas un CRUD brut.
- Chaque écran montre le statut de publication ou d'avancement.
- Les actions destructives sont confirmées.
- Les contenus incomplets et traductions manquantes sont visibles.
- Les formulaires gardent une densité lisible et des sections logiques.

## A-001 — Connexion admin

Objectif : permettre à l'administrateur de se connecter de façon sûre.

Champs :

- e-mail ;
- mot de passe.

États :

- initial ;
- soumission ;
- erreur identifiants ;
- compte désactivé ;
- trop de tentatives ;
- session expirée.

## A-002 — Dashboard

Objectif : donner une vue opérationnelle rapide.

Blocs :

- messages non lus ;
- projets publiés/brouillons ;
- contenus incomplets ;
- traductions manquantes ;
- raccourcis : ajouter projet, modifier profil, voir messages, gérer médias ;
- derniers changements sensibles si journal disponible.

Statut sous-phase 5.2 :

- shell, sidebar, toolbar et route `/admin/dashboard` implémentés ;
- compteurs affichés comme `Indisponible` ou `À vérifier` tant que les API métier n'existent pas ;
- raccourcis métier présents en état désactivé pour éviter d'anticiper les CRUD ;
- prévisualisation du site public disponible ;
- activité récente affichée en état vide explicite.

## A-003 — Profil

Objectif : gérer l'identité professionnelle.

Sections :

- identité ;
- titre/résumé/bio par langue ;
- photo ;
- CV ;
- coordonnées ;
- disponibilité ;
- réseaux ;
- CTA.

États :

- sauvegardé ;
- modifications non sauvegardées ;
- traduction manquante ;
- média invalide.

Statut sous-phase 5.3 :

- route `/admin/profile` implémentée dans le shell ;
- sections : identité, présentation FR/EN, disponibilité, coordonnées, photo, CV, liens, statistiques, visibilité ;
- formulaires réactifs typés ;
- upload/remplacement/suppression photo et CV ;
- états chargement, erreur, vide, succès et modifications non enregistrées ;
- inspection visuelle desktop/mobile exécutée.

## A-004 — Projets

Objectif : gérer les études de cas.

Liste :

- titre ;
- statut ;
- langue complète/incomplète ;
- mise en avant ;
- ordre ;
- date modification ;
- actions.

Formulaire :

- métadonnées ;
- traductions ;
- problème/contexte/solution/résultats ;
- technologies ;
- médias ;
- confidentialité ;
- SEO ;
- publication.

## A-005 — Compétences

Objectif : organiser les compétences par catégories.

Fonctions :

- catégories ;
- compétences ;
- descriptions traduites ;
- niveau qualitatif facultatif ;
- ordre ;
- publication.

Statut sous-phase 5.4 :

- route `/admin/skills` implémentée dans le shell ;
- listes catégories et compétences avec `p-table` pleine largeur ;
- filtres catégorie, statut et mise en avant avec composants PrimeNG ;
- formulaires en `p-dialog` centré ;
- sélection catégorie, niveau et statut avec `p-select` ;
- mise en avant avec `p-toggleswitch` ;
- visibilité publique avec `p-checkbox` ;
- statuts avec `p-tag` ;
- confirmations d'archivage/suppression sans `window.confirm` ;
- aucun `<select>` natif dans le périmètre 5.4 ;
- inspection visuelle réelle non exécutée, à reprendre dès runtime disponible.

## A-006 — Expériences

Objectif : gérer les expériences publiables.

Champs :

- entreprise ;
- poste par langue ;
- contrat ;
- lieu ;
- dates ;
- expérience en cours ;
- missions ;
- réalisations ;
- technologies ;
- confidentialité ;
- ordre/publication.

## A-007 — Services

Objectif : gérer les services proposés.

Champs :

- titre ;
- résumé ;
- description ;
- bénéfices ;
- livrables ;
- icône ;
- ordre ;
- activation/publication.

## A-008 — Messages

Objectif : traiter les demandes entrantes.

Liste :

- expéditeur ;
- type ;
- sujet ;
- statut ;
- date ;
- indicateur spam.

Détail :

- contenu ;
- coordonnées ;
- notes internes facultatives ;
- changement de statut ;
- archive/spam.

Règle : ne pas afficher publiquement et ne pas logger inutilement le contenu complet.

## A-009 — Médias

Objectif : gérer images et CV sans casser le site.

Fonctions :

- upload ;
- prévisualisation ;
- alt text ;
- type ;
- usages ;
- remplacement ;
- suppression contrôlée.

États :

- upload en cours ;
- format refusé ;
- taille refusée ;
- média utilisé ;
- média archivé.

## A-010 — SEO

Objectif : gérer les métadonnées.

Champs :

- page ou ressource ;
- langue ;
- title ;
- description ;
- Open Graph ;
- image ;
- robots index/follow ;
- canonical URL.

## A-011 — Paramètres

Objectif : gérer les paramètres essentiels.

Sections :

- langues ;
- site ;
- formulaire contact ;
- email réception ;
- maintenance ;
- footer ;
- favicon/logo.

Statut sous-phase 5.3 :

- route `/admin/settings` implémentée dans le shell ;
- paramètres typés : identité, langues, email réception, copyright, visibilité globale, sections ;
- upload/remplacement/suppression logo et favicon ;
- pas de moteur de paramètres clé-valeur générique ;
- inspection visuelle desktop/mobile exécutée.

## A-012 — Journal d'activité

Objectif : consulter les opérations sensibles.

Événements :

- connexion ;
- logout ;
- changement mot de passe ;
- publication/dépublication ;
- suppression ;
- upload/suppression média ;
- changement SEO ;
- paramètres.

## A-013 — Accès refusé / session expirée

Objectif : expliquer l'état et permettre une reconnexion.

Statut sous-phase 5.2 :

- pages existantes conservées ;
- inspection visuelle mobile exécutée ;
- page 404 interne admin ajoutée dans le shell.

## Dernière mise à jour

2026-07-26

## Sous-phase 5.5 — Écrans parcours

Routes :

- `/admin/experiences`
- `/admin/education`
- `/admin/certifications`

Principes UX :

- Une page unifiée de parcours avec listes structurées et formulaires modaux centrés.
- PrimeNG pour tableaux, statuts, confirmations, sélections, multisélections et dates.
- États vides explicites pour expériences, formations et certifications.
- Pas de select HTML natif ni de datepicker natif.

Réserve :

- Inspection visuelle navigateur authentifiée à compléter après récupération ou réinitialisation contrôlée du compte admin Docker existant.
