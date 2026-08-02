# Audit sécurité — Sous-phase 5.6 (médias, brouillons, confidentialité)

## Gate sécurité

```text
Access Control                : PASS
CSRF Protection                : PASS
Upload Validation              : PASS
Path Traversal Protection      : PASS
Draft/Archive Isolation        : PASS
Confidentiality Masking        : PASS
Media Exposure Control         : PASS
Configuration Consistency      : PASS AVEC RÉSERVE
Reviewer Verdict               : CONFORME
```

## Points vérifiés

- Aucun média projet n'est exposé via un mapping de ressources statiques : tout accès passe par un contrôleur (`AdminProjectController.readMedia`, `PublicProjectController.media`) avec vérification d'accès en amont dans `ProjectService`.
- `ProjectService.readPublicMedia` (`ProjectService.java:239-249`) bloque explicitement l'accès public aux médias des projets `DRAFT`, `ARCHIVED` et `PRIVATE` : seuls les médias de projets `PUBLISHED` et non `PRIVATE` sont servis publiquement.
- Confidentialité `ANONYMIZED` : masque `demoUrl`, `githubUrl` et `links` dans les réponses publiques, mais conserve les médias — comportement conforme à l'intention produit (étude de cas anonymisée mais illustrée).
- Confidentialité `PRIVATE` : projet totalement exclu des requêtes de liste, de détail et de mise en avant publiques (`findByPublicationStatusAndConfidentialityNotOrderByDisplayOrderAsc`, `findBySlugAndPublicationStatusAndConfidentialityNot`), vérifié par test d'intégration dédié.
- Upload média : whitelist de type de contenu et d'extension, limite de taille configurée (`ProjectMediaProperties.maxImageSize`, défaut 4MB), noms de fichiers assainis, vérification de confinement du chemin de stockage (protection anti path-traversal) — cohérent avec le motif déjà validé pour les médias profil (5.3).
- CSRF : toutes les mutations admin (création, modification, suppression, publication, upload, réordonnancement) exigent un jeton CSRF valide via le wrapper frontend `withCsrf()` et la configuration Spring Security existante (`SecurityConfiguration`), sans dérogation pour le module projets.
- Configuration `application.yml` (`app.project.media.*`) cohérente avec les valeurs par défaut du record `ProjectMediaProperties`.

## Réserve

- `ProjectService.uploadMedia` code en dur la limite de galerie à `12` au lieu de réutiliser `ProjectMediaProperties.maxGalleryItems()` (déjà injectée dans `ProjectMediaStorageService` mais pas dans `ProjectService`). Sans impact de sécurité immédiat (la valeur par défaut configurée est identique), mais à corriger pour éviter une dérive si la configuration externe change sans mise à jour du code. Reportée en dette technique.

## Verdict

`CONFORME AVEC RÉSERVE MINEURE TRACÉE`
