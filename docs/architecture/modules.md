# Modules

## Statut

Validé en Phase 2 — Architecture et conception.

## Modules applicatifs

| Module | Responsabilité | API publique | API admin |
|--------|----------------|--------------|-----------|
| Public Site | Composition des données publiques publiées | Oui | Non |
| Auth | Connexion, déconnexion, session, mot de passe, premier admin | Non | Oui |
| Identity | Profil, bio, disponibilité, CV, coordonnées, réseaux | Oui, lecture publiée | Oui |
| Content Sections | Activation, titres, contenu, ordre des sections | Oui, lecture publiée | Oui |
| Skills | Catégories, compétences, niveaux qualitatifs, ordre | Oui, lecture publiée | Oui |
| Experience | Expériences, formations, certifications, technologies | Oui, lecture publiée | Oui |
| Projects | Projets, études de cas, slugs, mise en avant, galerie | Oui, lecture publiée | Oui |
| Services | Services proposés, bénéfices, livrables, CTA, méthode de travail, liens compétences/technologies | Oui, lecture publiée | Oui |
| Testimonials | Témoignages réels, masqués si absents | Oui, lecture publiée | Oui |
| Contact | Soumission publique, statuts admin, spam | Soumission uniquement | Oui |
| Media | Images, captures, CV PDF, alt text, usages | Lecture contrôlée | Oui |
| SEO | Métadonnées, sitemap, robots, Open Graph | Oui | Oui |
| Settings | Langues, maintenance, paramètres généraux | Lecture limitée | Oui |
| Audit Log | Journal des opérations sensibles | Non | Oui |

## Dépendances autorisées

- Les modules métier peuvent dépendre d'abstractions partagées : erreurs, validation, pagination, i18n, audit.
- Les modules métier ne doivent pas dépendre des contrôleurs d'autres modules.
- Les modules publics utilisent des services de lecture filtrant publication et langue.
- Les modules admin utilisent les mêmes règles métier que les modules publics, avec droits d'écriture.
- Le module `audit` reçoit des événements applicatifs explicites ou appels de service, sans imposer de couplage fort.

## Modules transverses

- `shared-kernel` : identifiants, dates, statuts, erreurs, pagination, types de langue.
- `security` : configuration Spring Security, session, CSRF, permissions admin.
- `storage` : port de stockage média.
- `notification` : port e-mail.

## Règles de conception

- Aucun accès repository direct depuis les contrôleurs.
- DTO séparés des entités.
- DTO REST séparés en requêtes et réponses lorsque le module expose des écritures.
- DTO/résultats applicatifs placés dans `application.dto` lorsqu'ils ne sont pas des contrats HTTP.
- Services applicatifs placés dans `application.service`.
- Mappers placés dans `application.mapper` lorsqu'une conversion DTO répétée existe.
- Entités, enums et value objects placés dans `domain.model`.
- Repositories Spring Data placés dans `infrastructure.persistence`.
- Transactions au niveau service applicatif.
- Validation métier centralisée dans le module responsable.
- Les statuts de publication sont des invariants métier, pas des filtres UI.
- Les contrôleurs et services utilisent `@RequiredArgsConstructor` pour l'injection lorsque toutes les dépendances sont finales.

## Frontend public

La landing consomme les APIs publiques via `PublicHomeApiService` (`frontend/src/app/public/home/data-access/`). Elle n'injecte plus les services admin (CSRF, mutations). Les DTO publics restent partagés avec les modèles admin tant qu'ils décrivent le même contrat REST.

## Dernière mise à jour

2026-08-29
