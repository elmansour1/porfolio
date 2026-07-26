# Responsive et accessibilité

## Statut

Validé en Phase 3 — Conception UX/UI du portfolio.

## Cibles responsive

| Cible | Largeur de référence | Priorité |
|-------|----------------------|----------|
| Mobile compact | 360px | MUST |
| Mobile large | 390px à 430px | MUST |
| Tablette | 768px | MUST |
| Laptop | 1366px | MUST |
| Desktop large | 1440px+ | MUST |

## Règles responsive publiques

- Le Hero doit rester compréhensible sans scroll excessif.
- Le CTA contact doit rester accessible rapidement.
- Les compétences doivent passer de grilles à sections scannables.
- Les projets doivent privilégier 2 à 4 cartes mises en avant.
- Les pages projet doivent conserver un sommaire ou une progression lisible sur desktop, et une lecture linéaire sur mobile.
- Les médias ne doivent pas pousser le contenu critique hors écran.

## Règles responsive admin

- Mobile admin : tâches principales seulement, listes simplifiées, actions dans menus.
- Tablette/desktop : tableaux, filtres et actions groupées.
- Les formulaires longs sont découpés en sections.
- Les actions sauvegarder/publier restent visibles ou faciles à retrouver.
- Aucun champ critique ne doit être masqué sans alternative.

## Accessibilité cible

Référence : WCAG 2.2 AA lorsque réaliste pour le MVP.

## Exigences transverses

- Structure sémantique : `header`, `main`, `section`, `nav`, `footer`.
- Hiérarchie de titres logique.
- Navigation clavier complète.
- Focus visible et non masqué.
- Contrastes suffisants.
- Labels associés aux champs.
- Erreurs reliées aux champs.
- Textes alternatifs pour médias significatifs.
- Pas de dépendance exclusive à la couleur.
- Préférence `prefers-reduced-motion` respectée.
- Modales et menus accessibles.

## Formulaires

- Labels visibles ou techniquement équivalents.
- Aide contextuelle pour formats complexes.
- Validation à la sortie de champ ou soumission sans bruit excessif.
- Résumé d'erreur en haut des formulaires longs.
- Focus déplacé vers la première erreur après soumission invalide.
- Bouton désactivé ou état loading pendant soumission.

## Tables et listes admin

- En-têtes explicites.
- Actions nommées via texte ou labels accessibles.
- Statuts textuels en plus des couleurs.
- Filtres accessibles au clavier.
- Alternatives aux actions par glisser-déposer pour l'ordre.

## Médias

- Alt text requis pour médias porteurs d'information.
- Alt vide accepté uniquement pour décoration réelle.
- Captures confidentielles interdites.
- Images responsives et recadrage maîtrisé.

## Validation

Inspection réelle à exécuter dès qu'une interface existe. En Phase 3, validation statique uniquement.

## Dernière mise à jour

2026-07-21
