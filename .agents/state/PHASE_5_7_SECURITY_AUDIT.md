# Audit sécurité — Sous-phase 5.7

## Verdict

`CONFORME`

## Points vérifiés

- Endpoints admin protégés par session Spring Security et CSRF.
- Endpoints publics explicitement autorisés seulement en lecture.
- Brouillons et archives exclus des APIs publiques.
- Archivage/dépublication retirent la mise en avant.
- Publication refusée si contenu minimum, bénéfice actif ou livrable actif manquent.
- CTA externes validés en URL `http/https` avec hôte.
- CTA e-mail validés.
- URL de visuel facultative validée côté backend.
- Références compétences/technologies vérifiées par existence dans `skill`.
- Opérations sensibles journalisées via `activity_log`.

## Tests

`ProfessionalServiceControllerTests` couvre accès admin non autorisé, création/publication/public, mise en avant invalide, CTA externe invalide, archivage retirant le public et étapes de méthode publiées.

## Réserves

Aucune réserve bloquante.
