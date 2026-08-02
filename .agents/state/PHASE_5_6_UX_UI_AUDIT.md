# Audit UX/UI — Sous-phase 5.6

## Écrans concernés

- Administration : gestion des projets et études de cas via `/admin/projects` (liste, création, édition, galerie média, publication, mise en avant, ordre).
- Public : liste des projets `/projects` et détail `/projects/:slug`.

## Vérifications

- Formulaire admin structuré par blocs : informations principales, période, confidentialité/publication, traductions FR/EN par onglets, compétences liées, liens, galerie média.
- Composants PrimeNG pour toutes les sélections, dates, bascules, tableau, dialogue et upload — aucun contrôle natif non stylé.
- États vides prévus pour la liste des projets (admin et public).
- Section publique liste : grille de cartes (`public-projects-grid`, `public-project-card`) avec image de couverture, titre, résumé, tags de compétences.
- Page détail publique : galerie (`public-project-gallery`), sections de contenu (`CONTENT_SECTIONS`), liens externes conditionnés par confidentialité.
- Réutilisation cohérente des tokens de design existants (couleurs, espacements, rayons) : aucune nouvelle variable CSS ad hoc introduite hors des blocs `styles.scss:1590-1764`.
- Media queries ajoutées à 1050px et 720px cohérentes avec les points de rupture déjà utilisés par `career`/`skills`.
- Accessibilité statique : `alt` sur les images de galerie, `figcaption` pour les légendes, `aria-label` sur les contrôles d'action ; focus clavier hérité de la règle globale `:focus-visible` (`styles.scss:32-36`, `outline: 2px solid var(--color-accent)`), donc appliqué automatiquement aux nouveaux éléments interactifs sans déclaration supplémentaire.
- Bilinguisme FR/EN vérifié dans `project-labels.ts` et les traductions de formulaire.

## Limites

- **VALIDATION VISUELLE NON EXÉCUTÉE** : aucun navigateur ni outil de capture d'écran n'était disponible dans cet environnement d'exécution pour cette sous-phase. L'audit UX/UI s'est limité à une revue statique du code TypeScript/HTML/SCSS et des règles d'accessibilité globales déjà en vigueur. Une inspection visuelle réelle (desktop/tablette/mobile, thèmes, focus clavier interactif) reste recommandée avant mise en production.
- Pas d'audit automatisé axe/Lighthouse.
- Aucune capture d'écran n'a été produite pour ce périmètre (à la différence de la correction formulaires du 2026-08-02 qui disposait d'un serveur de développement accessible).

## Verdict

`CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES (validation visuelle non exécutée, revue statique OK)`
