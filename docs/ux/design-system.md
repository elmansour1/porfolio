# Design System

## Statut

Validé en Phase 3 — Conception UX/UI du portfolio.

Ce document définit la direction, les tokens et les composants attendus. Il ne valide pas un rendu réel : l'inspection visuelle devra être exécutée après prototype ou implémentation frontend.

## Direction

Deux surfaces cohérentes :

- site public premium, éditorial, orienté preuve et contact ;
- administration utilitaire premium, dense mais lisible, orientée tâches.

Le design doit être sobre, distinctif, moderne et adapté à un profil tech. Il doit éviter l'apparence de template gratuit ou de CRUD brut.

## Principes visuels

- Le nom et le positionnement professionnel doivent être visibles dans le premier viewport public.
- La page publique doit laisser deviner la section suivante sur desktop et mobile.
- L'administration doit être plus dense que le site public, sans devenir un CRUD brut.
- Les cartes ne doivent pas être empilées dans d'autres cartes.
- Les statistiques, témoignages et résultats chiffrés sont masqués tant que les données réelles ne sont pas disponibles.
- Les compétences utilisent des catégories et descriptions qualitatives, pas de pourcentages.
- Les actions principales, secondaires et destructives doivent être différenciées visuellement.

## Tokens fonctionnels

Les noms ci-dessous sont des intentions. Les valeurs numériques exactes seront fixées pendant l'implémentation puis inspectées.

| Famille | Tokens | Règle |
|---------|--------|-------|
| Couleurs neutres | `surface`, `surface-muted`, `surface-inverse`, `border`, `text`, `text-muted` | Palette sobre, contraste AA minimum, pas de thème monochrome. |
| Accent | `accent`, `accent-hover`, `accent-soft`, `accent-contrast` | Une couleur d'accent principale, réservée aux CTA, focus et éléments de statut importants. |
| Statuts | `success`, `warning`, `danger`, `info`, `draft`, `published`, `archived`, `spam` | Couleur + libellé + icône ou forme, jamais couleur seule. |
| Typographie | `display`, `title`, `section`, `body`, `caption`, `code` | Échelle claire ; l'admin n'utilise pas de tailles hero. |
| Espacements | `space-1` à `space-8` | Grille régulière ; respiration forte public ; densité maîtrisée admin. |
| Rayons | `radius-sm`, `radius-md`, `radius-lg` | Rayons modérés ; cartes et panneaux à 8 px ou moins sauf justification. |
| Ombres | `shadow-sm`, `shadow-md`, `shadow-focus` | Subtiles, liées à hiérarchie ou focus, pas décoratives. |
| Dimensions | `header-height`, `sidebar-width`, `form-max-width`, `content-max-width` | Dimensions stables pour limiter les déplacements de layout. |
| Mouvement | `motion-fast`, `motion-standard`, `motion-reduced` | Animations discrètes et désactivables via `prefers-reduced-motion`. |

## Composants publics

| Composant | Responsabilité | États attendus |
|-----------|----------------|----------------|
| Header public | Navigation, langue, contact, CV facultatif | Mobile ouvert/fermé, section active, focus clavier |
| Hero | Nom, titre, proposition de valeur, CTA, visuel réel ou placeholder explicite | Contenu chargé, absence photo, disponibilité masquée si inconnue |
| Crédibilité | Faits réels seulement | Masquée si aucune donnée validée |
| À propos | Positionnement et manière de travailler | Contenu court/long, traduction manquante |
| Compétences | Catégories et compétences qualitatives | Vide, catégorie sans item masquée |
| Projets | Projets mis en avant et cartes | Vide, confidentiel, image absente avec visuel de remplacement |
| Détail projet | Étude de cas structurée | Projet introuvable, non publié, galerie vide |
| Expériences | Chronologie ou liste professionnelle | Expérience en cours, confidentialité |
| Services | Offres activables | Section masquée si aucun service publié |
| Méthode | Processus de travail | Texte court, icônes décoratives masquées aux lecteurs d'écran |
| Contact | Formulaire, consentement, retours | Loading, succès, validation, erreur réseau, spam probable |
| Footer | Navigation secondaire, coordonnées, légal | Coordonnées absentes, langue |
| Pages légales | Privacy, legal | Contenu à compléter, liens de retour |
| 404 | Récupération | Lien accueil/projets/contact |

## Composants admin

| Composant | Responsabilité | États attendus |
|-----------|----------------|----------------|
| Admin shell | Navigation par domaines, topbar, déconnexion | Sidebar réduite, mobile, session expirée |
| Dashboard | Prioriser messages, brouillons, contenus incomplets | Chargement, vide, erreur partielle |
| Data table | Recherche, filtres, tri, actions de contenu | Vide, aucun résultat, pagination, sélection |
| Content editor | Edition structurée FR/EN | Brouillon, publié, erreurs, changements non sauvegardés |
| Translation status | Montrer complétude par langue | FR/EN complet, incomplet, non publiable |
| Publication controls | Publier, dépublier, archiver | Confirmations, action en cours, refus |
| Media uploader | Upload contrôlé, alt text, usages | Format refusé, taille refusée, suppression bloquée |
| Status badge | `DRAFT`, `PUBLISHED`, `ARCHIVED`, `NEW`, `SPAM` | Icône/libellé + couleur |
| Confirm dialog | Actions sensibles | Focus piégé, annulation claire |
| Empty/Error/Loading states | Feedback cohérent | Action de récupération quand possible |

## Implémentation admin 5.2

Composants livrés :

- `AdminShell` : sidebar, toolbar, menu compte, déconnexion, overlay mobile et contenu routé.
- `AdminDashboard` : métriques indisponibles explicites, actions rapides, état de publication et activité vide.
- `StatusBadge` : états `secure`, `warning`, `unavailable`, `ready`.
- `EmptyState` : état vide accessible avec titre et description.
- `MetricCard` et `QuickAction` : cartes limitées au dashboard.

Décisions visuelles :

- sidebar fixe desktop, overlay mobile ;
- actions non implémentées affichées en état désactivé, non cliquables ;
- dashboard sans chiffres fictifs ;
- palette neutre claire avec accent vert professionnel, complétée par statuts bleu/jaune/gris ;
- rayons modérés et bordures discrètes ;
- pas de carte imbriquée dans une carte de page, seulement cartes de métriques et panneaux de dashboard.

Corrections issues de l'inspection :

- breakpoint tablette ajusté pour éviter le débordement des panneaux inférieurs ;
- état désactivé des actions rapides renforcé visuellement.

## Implémentation compétences 5.4

Règles appliquées :

- `p-select` pour les filtres et champs catégorie/statut/niveau ;
- `p-toggleswitch` pour la mise en avant ;
- `p-checkbox` pour la visibilité publique ;
- `p-table` pour les listes admin ;
- `p-tag` pour les statuts ;
- `p-dialog` pour les formulaires et confirmations ;
- aucun `<select>` natif dans le périmètre compétences.

Réserve : le rendu réel des overlays, focus et responsive doit être inspecté dès que Docker/backend sont disponibles.

Correctif qualité 2026-07-26 : les sélecteurs natifs profil/paramètres ont aussi été remplacés par `p-select`, avec labels associés par `inputId`.

## Répartition technique

- Tailwind CSS : layout, grille, flex, espacements, responsive.
- PrimeNG : tables admin, dialogs, menus, inputs avancés, confirmations.
- SCSS : tokens, thème, intégration PrimeNG, animations spécifiques.

## Ton rédactionnel UI

- Public : précis, professionnel, orienté valeur et preuve.
- Admin : direct, opérationnel, orienté tâche.
- Erreurs : compréhensibles, sans détails techniques sensibles.
- Succès : confirmer l'action et indiquer l'impact public lorsque pertinent.
- Contenus d'exemple : toujours signalés comme exemples, jamais publiés comme faits.

## Architecture d'information publique

Ordre recommandé MVP :

1. Hero.
2. Crédibilité factuelle réelle.
3. À propos court.
4. Compétences structurées.
5. Projets mis en avant.
6. Expériences.
7. Services.
8. Méthode.
9. Contact.

## Responsive

- Mobile public : compréhension rapide, navigation compacte, CTA accessible.
- Desktop public : lecture rapide, comparaison projets/compétences.
- Admin : responsive raisonnable centrée sur les tâches principales, pas reproduction pixel-perfect desktop.

## Accessibilité

- Structure sémantique.
- Navigation clavier.
- Focus visible.
- Contrastes suffisants.
- Labels associés.
- Textes alternatifs.
- Messages d'erreur compréhensibles.
- Absence de dépendance exclusive à la couleur.
- `prefers-reduced-motion` pour animations.

## Gate SaaS premium de conception

| Critère | Statut Phase 3 |
|---------|----------------|
| Hiérarchie publique | PASS |
| Parcours public principal | PASS |
| Parcours admin principal | PASS |
| Design tokens définis | PASS |
| Composants publics listés | PASS |
| Composants admin listés | PASS |
| États d'interface définis | PASS |
| Responsive défini | PASS |
| Accessibilité définie | PASS |
| Inspection visuelle réelle | NOT EXECUTED |
| Verdict conception | CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES |

## À éviter

- Jauges de compétences en pourcentage.
- Statistiques fictives.
- Témoignages fictifs.
- Dégradés excessifs.
- Cartes partout sans hiérarchie.
- Animations décoratives lourdes.
- Interfaces admin vieillissantes.

## Dernière mise à jour

2026-07-26
