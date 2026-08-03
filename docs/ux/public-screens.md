# Spécification des écrans publics

## Statut

Validé en Phase 3 — Conception UX/UI du portfolio. Section compétences alimentée par données publiques implémentée en sous-phase 5.4. Sections Services et Méthode alimentées par API implémentées en sous-phase 5.7.

## Écran P-001 — Landing page `/`

### Objectif

Permettre à un visiteur de comprendre le profil en moins d'une minute et d'accéder rapidement aux preuves ou au contact.

### Sections

1. Header
2. Hero
3. Crédibilité factuelle
4. À propos
5. Compétences
6. Projets mis en avant
7. Expériences
8. Services
9. Méthode
10. Contact
11. Footer

### Hero

Contenu :

- nom complet ;
- titre professionnel ;
- spécialité Java/Spring Boot/Angular ;
- proposition de valeur courte ;
- CTA principal : contacter ;
- CTA secondaire : voir les projets ou télécharger le CV ;
- liens GitHub/LinkedIn ;
- disponibilité si réelle.

Validation :

- le message principal tient sur un écran mobile sans texte excessif ;
- aucun chiffre fictif ;
- CTA principal identifiable.

### Crédibilité factuelle

Afficher uniquement des faits vérifiés : technologies fortes, disponibilité, nombre de projets si réel, domaines d'expertise.

### Compétences

Catégories : Backend, Frontend, Base de données, DevOps, Conception.

Règles :

- pas de pourcentages ;
- descriptions courtes ;
- niveau qualitatif facultatif.

Statut sous-phase 5.4 :

- catégories publiées regroupant les compétences publiées et visibles ;
- compétences principales mises en avant visuellement sans jauge artificielle ;
- traduction selon la langue demandée, sans fallback métier automatique ;
- catégories vides masquées ;
- état propre si aucune compétence publiée n'est disponible ;
- inspection visuelle réelle non exécutée dans l'environnement courant.

### Projets mis en avant

Afficher 2 à 4 projets solides plutôt qu'une longue galerie.

Chaque carte montre :

- titre ;
- résumé ;
- rôle ;
- technologies principales ;
- confidentialité éventuelle ;
- lien détail.

### Contact

Champs :

- nom ;
- e-mail ;
- entreprise facultative ;
- type de demande ;
- sujet ;
- message ;
- consentement confidentialité.

États :

- initial ;
- validation ;
- soumission ;
- succès ;
- erreur réseau ;
- erreur validation backend ;
- spam suspect si applicable.

## Écran P-002 — Détail projet `/projects/:slug`

### Objectif

Présenter une étude de cas claire, crédible et confidentielle.

### Structure

1. En-tête projet : titre, résumé, rôle, technologies, statut confidentiel si applicable.
2. Contexte.
3. Problème.
4. Objectifs.
5. Rôle et responsabilités.
6. Solution.
7. Architecture synthétique.
8. Fonctionnalités principales.
9. Défis techniques.
10. Décisions importantes.
11. Résultats réels disponibles.
12. Galerie.
13. Liens disponibles.
14. Projets similaires ou retour aux projets.
15. CTA contact.

### Validation

- aucune donnée confidentielle ;
- contenu lisible sans captures ;
- médias avec alt text ;
- page accessible via slug publié uniquement.

## Écran P-003 — Politique de confidentialité `/privacy`

### Objectif

Expliquer clairement les données collectées, notamment les messages de contact.

### Contenu attendu

- données collectées ;
- finalité ;
- durée de conservation à compléter avant release ;
- contact ;
- cookies/analytics si retenus ;
- droits utilisateur selon contexte légal retenu.

## Écran P-004 — Mentions légales `/legal`

### Objectif

Fournir les informations légales nécessaires selon le pays/hébergement retenu.

### Contenu

À compléter avant release avec domaine, responsable publication, hébergeur et contact.

## Écran P-005 — Page 404

### Objectif

Permettre de récupérer une navigation lorsque la page est introuvable.

### Contenu

- message clair ;
- lien accueil ;
- lien projets ;
- lien contact.

## Écran P-006 — Liste projets `/projects`

### Statut

`COULD` MVP. À activer seulement si le volume de projets justifie une page dédiée.

## Dernière mise à jour

2026-08-03

## Sous-phase 5.5 — Section publique parcours

La page publique affiche désormais, lorsque les données sont publiées :

- expériences chronologiques ;
- formations ;
- certifications ;
- technologies liées aux expériences.

Règles UX :

- Aucun bloc vide ne doit être affiché.
- Les expériences confidentielles affichent un libellé public maîtrisé.
- La section doit valoriser le parcours sans recopier un CV brut.

## Sous-phase 5.7 — Sections publiques Services et Méthode

La page publique affiche désormais, lorsque les données sont publiées :

- services professionnels avec titre, résumé, problème résolu, bénéfices principaux et CTA ;
- mise en avant visuelle modérée pour les services `featured` ;
- méthode de travail avec étapes ordonnées, numéro affiché hors texte traduit, description et résultat attendu ;
- contenus issus des APIs publiques, sans services codés en dur dans le template Angular.

Règles UX :

- Aucun tarif, délai garanti, faux client, témoignage ou promesse chiffrée.
- Aucun CTA sans destination réelle.
- Les sections peuvent apparaître même si le profil principal n'est pas encore publié, car leur publication est indépendante.
- Inspection visuelle publique exécutée via Chrome headless sur desktop et mobile.
## Sous-phase 5.8 — Landing publique finale

La landing publique assemblée présente, selon les données publiées et visibles :

1. Header public avec monogramme, navigation courte, langues, CTA contact conditionnel et menu mobile.
2. Hero avec état profil publié ou état propre “portfolio en préparation”.
3. Indicateurs professionnels réels si publiés.
4. À propos si profil publié et contenu disponible.
5. Compétences si section visible et données publiées.
6. Projets mis en avant si disponibles.
7. Parcours avec expériences et formations/certifications selon visibilité séparée.
8. Services publiés avec bénéfices et CTA valides.
9. Méthode de travail publiée dans l'ordre.
10. CTA collaboration/contact si section Contact visible.
11. Footer public sans lien admin principal.

Inspection réelle 5.8 :

- Desktop, mobile, tablette, menu mobile, pleine page, reduced motion et navigation clavier vérifiés via backend H2 + SSR + Chrome headless.
- Captures principales dans `/tmp/home-desktop-final.png`, `/tmp/home-mobile-final.png`, `/tmp/home-mobile-menu.png`, `/tmp/home-fullpage.png`, `/tmp/home-reduced-motion-final.png`.
- Réserve : l'état réellement inspecté contient `profilePublished=false` et des services/méthode publiés ; le rendu complet avec profil réel publié doit être recapturé avant mise en ligne.
