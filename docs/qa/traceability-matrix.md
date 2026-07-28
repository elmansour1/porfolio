# Matrice de traçabilité

## Statut

Validée pour cadrage Phase 1 — à compléter avec outils et cas détaillés en Phase 2.

| Exigence | Parcours | Tests attendus | Statut |
|----------|----------|----------------|--------|
| FR-001 | Découverte profil | Tests frontend, E2E navigation, inspection visuelle responsive | À définir |
| FR-002 | Publication/dépublication | Tests backend règles publication, tests public masquage | À définir |
| FR-003 | Détail projet | Test route `/projects/:slug`, slug inconnu, projet non publié | À définir |
| FR-004 | FR/EN | Tests changement langue, traduction absente selon stratégie | À définir |
| FR-005 | Contact | Tests formulaire frontend, validation API, consentement, double soumission | À définir |
| FR-006 | Messages admin | Tests API messages, statuts, affichage admin | À définir |
| FR-007 | Admin protégé | Tests sécurité routes frontend/backend et accès API | À définir |
| FR-008 | Profil | Tests CRUD profil, publication, CV, réseaux | À définir |
| FR-009 | Compétences | Tests catégories, ordre, publication, absence de pourcentages | Livré 5.4 — backend/front tests PASS, inspection visuelle à reprendre |
| FR-010 | Expériences | Tests dates, expérience en cours, tri, confidentialité | À définir |
| FR-011 | Projets | Tests publication, mise en avant, médias, slug unique | À définir |
| FR-012 | Services | Tests activation/publication et affichage public | À définir |
| FR-013 | Médias | Upload valide, refus format/taille dangereux, alt text, suppression utilisée | À définir |
| FR-014 | SEO | Tests métadonnées, sitemap, robots.txt, Open Graph | À définir |
| FR-015 | Journal sensible | Tests création d'événements pour connexions/publications/suppressions/médias | À définir |
| FR-016 | Témoignages | Tests section masquée sans témoignage publié | À définir |
| FR-017 | Prévisualisation | Tests sauvegarde sans publication automatique | À définir |
| FR-018 | Dashboard | Tests indicateurs et raccourcis si données disponibles | À définir |
| NFR-001 | Landing publique | Audit Lighthouse ou équivalent, budgets assets, images | À définir |
| NFR-002 | Responsive | Contrôles 360px, 768px, 1366px, 1440px+ | À définir |
| NFR-003 | Accessibilité | Audit clavier, labels, contrastes, focus, erreurs | À définir |
| NFR-004 | Sécurité | Tests auth, autorisations, rate limit, injection, upload | À définir |
| NFR-005 | Confidentialité | Tests consentement, logs, conservation/suppression | À définir |
| NFR-006 | Internationalisation | Tests contenus traduisibles et stratégie traduction absente | À définir |
| NFR-007 | SEO | Tests indexabilité selon ADR rendu Angular | À définir |
| NFR-008 | Maintenabilité | Gates frontend/backend et revue code | À définir |
| NFR-009 | Simplicité | Revue scope contre exclusions MVP | À définir |
| NFR-010 | Observabilité | Tests journalisation et logs structurés | À définir |
| NFR-011 | Portabilité | Vérification variables/env et absence secrets | À définir |
| NFR-012 | Sauvegarde | Test procédure sauvegarde/restauration avant release | À définir |
| NFR-013 | Médias | Tests sécurité, performance, confidentialité médias | À définir |
| NFR-014 | UX/UI premium | Audit UX/UI, inspection visuelle réelle, responsive | À définir |

## Dernière mise à jour

2026-07-26

## Sous-phase 5.5 — Traçabilité

| Exigence | Implémentation | Vérification | Statut |
|----------|----------------|--------------|--------|
| Gérer expériences | Backend `career`, page admin parcours | `CareerTimelineControllerTests`, `CareerPage` spec | PASS |
| Gérer formations | Backend `career`, page admin parcours | `CareerTimelineControllerTests`, `CareerPage` spec | PASS |
| Gérer certifications | Backend `career`, page admin parcours | `CareerTimelineControllerTests`, `CareerPage` spec | PASS |
| Pas de select natif | PrimeNG `p-select`, `p-multiselect`, `p-datepicker` | Scan `frontend/src/app`, spec composants | PASS |
| API publique sans brouillons/confidentiel | `PublicCareerController`, `CareerMapper` | Tests backend confidentialité/publication | PASS |
| Runtime Docker | `docker compose` | Build/up + routes HTTP | PASS |
