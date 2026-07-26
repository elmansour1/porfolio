# Matrice de validation des écrans

## Statut

Validé en Phase 3 — Conception UX/UI du portfolio.

## Site public

| Écran | Parcours | Critères UX | Accessibilité | Statut |
|-------|----------|-------------|----------------|--------|
| Landing `/` | Découverte, contact | Profil compris rapidement, CTA clair, sections ordonnées, aucun contenu fictif | Titres, clavier, contrastes, alt text | Affichage profil/paramètres limité implémenté 5.3 ; landing complète à venir |
| Projet détail | Évaluation technique | Étude de cas complète, rôle clair, confidentialité respectée | Structure sémantique, médias alt | Validé conception |
| Contact | Demande de contact | Formulaire clair, consentement, erreurs, succès | Labels, erreurs reliées, focus erreur | Validé conception |
| Privacy | Légal | Contenu lisible, durée conservation à compléter | Structure texte | Validé avec réserve |
| Legal | Légal | Informations hébergeur à compléter | Structure texte | Validé avec réserve |
| 404 | Récupération | Message clair, liens utiles | Focus et navigation | Validé conception |
| Projects list | Exploration | Différable sauf volume suffisant | Cartes/listes accessibles | COULD |

## Administration

| Écran | Parcours | Critères UX | Accessibilité | Statut |
|-------|----------|-------------|----------------|--------|
| Login | Auth admin | Simple, sécurisé, erreurs claires | Labels, focus, erreurs | Validé conception |
| Dashboard | Pilotage | Messages, brouillons, incomplets, raccourcis | Cartes/lists accessibles | Implémenté 5.2 — inspecté desktop/tablette/mobile |
| Profil | Gestion profil | Sections logiques, FR/EN, médias | Form labels, erreurs | Implémenté 5.3 — inspecté desktop/mobile |
| Projets liste | Gestion projets | Statuts visibles, recherche/filtre, actions | Table accessible | Validé conception |
| Projet éditeur | Étude de cas | Sections, traduction, médias, SEO, publication | Form long accessible | Validé conception |
| Compétences | Gestion compétences | Catégories, ordre, qualitatif | Alternatives drag/drop | Validé conception |
| Expériences | Gestion parcours | Dates, en cours, confidentialité | Form accessible | Validé conception |
| Services | Gestion offres | Activation/publication, bénéfices | Form accessible | Validé conception |
| Messages | Traitement demandes | Statuts, spam, archive, confidentialité | Table + détail accessibles | Validé conception |
| Médias | Gestion fichiers | Upload, alt, usages, suppression contrôlée | Input file accessible | Validé conception |
| SEO | Métadonnées | Page/langue, preview sociale si possible | Champs explicites | Validé conception |
| Paramètres | Réglages | Essentiels seulement | Sections claires | Implémenté 5.3 — inspecté desktop/mobile |
| Activity log | Audit | Événements sensibles sans données excessives | Table accessible | Validé conception |
| Accès refusé/session expirée | Sécurité UX | Reconnexion claire | Focus action principale | Implémenté 5.1, réinspecté 5.2 |
| 404 admin | Récupération admin | Message clair, retour dashboard | Structure shell + action clavier | Implémenté 5.2 — inspecté desktop |

## Réserves

- Inspection visuelle réelle Phase 5.2 exécutée pour le shell admin, dashboard, menu mobile, 404 admin, 403 et session expirée.
- Contenus légaux réels à compléter avant release.
- Hébergeur et fournisseur e-mail à décider.
- Textes finaux FR/EN à rédiger avant implémentation complète.
- Inspection visuelle réelle Phase 5.3 exécutée pour profil, paramètres et rendu public limité.
- Audit accessibilité outillé non exécuté.

## Dernière mise à jour

2026-07-22
