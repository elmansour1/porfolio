# ADR-0013 — Services professionnels et méthode de travail

## Statut

Accepté

## Date

2026-08-03

## Contexte

La sous-phase 5.7 doit permettre de gérer les services professionnels réellement proposés et la méthode de travail, avec publication, archivage, ordre, mise en avant, traductions, bénéfices, livrables, appels à l'action et relations aux compétences/technologies.

Le projet possède déjà un référentiel `skill` administrable et public. Créer un second référentiel de technologies pour les services introduirait une duplication, des libellés concurrents et des risques d'incohérence entre compétences, parcours, projets et services.

## Décision

- Les services sont modélisés par un agrégat `professional_service`.
- Les bénéfices et livrables sont des entités structurées, ordonnées, activables et traduisibles, et non des chaînes séparées par virgules.
- Les technologies et compétences liées aux services réutilisent le référentiel `skill` existant via `service_skill`, avec un type de relation stable `TECHNOLOGY` ou `SKILL`.
- La méthode de travail est modélisée par `work_process_step` et ses traductions.
- Le workflow éditorial reste simple : `DRAFT`, `PUBLISHED`, `ARCHIVED`.
- Les API publiques excluent les brouillons, archives, informations d'audit et identifiants techniques inutiles.
- Les CTA utilisent des types stables : `CONTACT`, `PROJECTS`, `EMAIL`, `RESUME`, `EXTERNAL_URL`.
- Les services initiaux restent des seeds conservateurs en base, sans tarifs, délais garantis, faux clients, faux résultats ni promesses chiffrées.

## Conséquences

- Pas de marketplace, système de devis, réservation, paiement ou CRM.
- Les futurs écrans doivent sélectionner les technologies/compétences par identifiant `skill`, jamais par libellé traduit.
- La qualité des contenus dépend du remplissage réel des traductions et de la publication explicite.
- Les services peuvent être présentés publiquement même si le profil principal n'est pas encore publié, dès lors que les services eux-mêmes sont publiés.

## Alternatives rejetées

- Table `technology` dédiée : rejetée pour éviter une taxonomie parallèle non nécessaire.
- JSON libre pour bénéfices/livrables : rejeté car l'ordre, l'activation, les traductions et les tests seraient moins contrôlables.
- Publication implicite lors de la sauvegarde : rejetée pour préserver le contrôle éditorial.
