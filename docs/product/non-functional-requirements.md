# Exigences non fonctionnelles

## Statut

Validé en Phase 1 — Cadrage produit. Les seuils techniques définitifs seront confirmés en Phase 2.

## Exigences

| ID | Catégorie | Description | Critère vérifiable initial |
|----|-----------|-------------|----------------------------|
| NFR-001 | Performance | Le site public doit charger rapidement, y compris sur connexion limitée | Budget cible à fixer en Phase 2 ; images optimisées, lazy loading, dépendances maîtrisées et audit Lighthouse ou équivalent avant release |
| NFR-002 | Responsive | Le site public et l'administration doivent fonctionner sur mobile et desktop | Contrôle à minima : 360px, 768px, 1366px, 1440px+ |
| NFR-003 | Accessibilité | Le site vise une base WCAG 2.2 AA lorsque réaliste pour le MVP | Navigation clavier, focus visible, contrastes, labels, alt text, erreurs annoncées et absence de dépendance exclusive à la couleur |
| NFR-004 | Sécurité | L'administration, les messages et les médias doivent être protégés | Auth sécurisée, validation backend, limitation tentatives, contrôle fichiers, autorisations backend |
| NFR-005 | Confidentialité | Les données personnelles et messages doivent être traités avec politique claire | Consentement formulaire, durée de conservation définie, logs sans données sensibles |
| NFR-006 | Internationalisation | Français par défaut, anglais dans le MVP | Contenus traduisibles séparés, stratégie de traduction absente documentée avant implémentation |
| NFR-007 | SEO | Les pages publiques doivent être indexables selon architecture retenue | Métadonnées, URLs propres, sitemap, robots.txt, Open Graph ; stratégie CSR/prérendu/SSR décidée par ADR |
| NFR-008 | Maintenabilité | Code frontend/backend de niveau senior | Gates frontend/backend obligatoires avant clôture technique |
| NFR-009 | Simplicité | Le MVP ne doit pas devenir un CMS générique | Exclusions respectées, KISS/YAGNI, revue indépendante |
| NFR-010 | Observabilité | Les opérations sensibles doivent être traçables | Journal d'activité et logs structurés sans secrets |
| NFR-011 | Portabilité | Configuration par environnement sans secret dans le dépôt | Variables d'environnement et documentation |
| NFR-012 | Sauvegarde | PostgreSQL doit disposer d'une stratégie de sauvegarde/restauration | Procédure à définir avant livraison |
| NFR-013 | Médias | Les médias ne doivent pas dégrader performance, sécurité ou confidentialité | Formats whitelistés, taille max, alt text, compression, contrôle d'usage |
| NFR-014 | UX/UI premium | Le public et l'admin doivent éviter l'apparence générique | Direction artistique Phase 2, inspection visuelle réelle, gate UX/UI |

## Seuils à fixer en Phase 2

- Budget JS/CSS initial.
- Poids maximal des images et CV PDF.
- Formats médias autorisés.
- Limites anti-spam et rate limiting.
- Durée de session ou jeton.
- Durée de conservation des messages.
- Stratégie de rendu SEO.

## Catégories de référence

- Performance
- Sécurité
- Disponibilité
- Scalabilité proportionnée
- Accessibilité
- Internationalisation
- Maintenabilité
- Observabilité
- Confidentialité
- UX/UI

## Dernière mise à jour

2026-07-21
