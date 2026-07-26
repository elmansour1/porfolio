# PROJECT BRIEF

## Métadonnées du document

- **Projet :** Portfolio professionnel de Faouzi El Mansour
- **Type de produit :** Application web avec site public et espace d'administration
- **Version du brief :** 1.0
- **Statut :** Cadrage initial
- **Propriétaire du produit :** Faouzi El Mansour
- **Langues initiales :** Français et anglais
- **Marché principal :** Cameroun, Afrique et Europe
- **Orientation professionnelle :** Développement logiciel, backend Java/Spring Boot, frontend Angular, DevOps et conception de solutions numériques

## 1. Statut du projet

Valeurs possibles : `NOUVELLE_IDÉE` | `NOUVEAU_PROJET` | `PROJET_EXISTANT`

**Valeur :** `NOUVEAU_PROJET`

Le projet doit être construit à partir de zéro en utilisant le framework d'entreprise virtuelle d'ingénierie logicielle. Aucune fonctionnalité existante n'est à préserver.

## 2. Nom du projet

**Nom principal :** Portfolio professionnel de Faouzi El Mansour

**Nom technique provisoire :** `faouzi-portfolio`

**Nom de domaine envisagé :** À déterminer (`faouzielmansour.com`, `elmansour.dev`, `faouzi.dev` possibles). Le choix définitif du nom de domaine ne fait pas partie de la première phase d'implémentation.

## 3. Idée principale

Construire un portfolio professionnel moderne permettant de présenter clairement le profil, les compétences, l'expérience, les projets, les services et les coordonnées de Faouzi El Mansour.

Le produit doit comporter deux espaces principaux :

1. un site public sous forme de landing page premium ;
2. un espace d'administration sécurisé permettant de gérer le contenu affiché sur le site public.

Le portfolio ne doit pas être un simple CV en ligne statique. Il doit constituer une vitrine professionnelle capable de présenter une identité forte, démontrer les compétences techniques, exposer des projets et études de cas, valoriser l'expérience, rassurer recruteurs et clients, faciliter la prise de contact, permettre la mise à jour du contenu sans modifier le code, et servir de support aux candidatures et démarches commerciales.

Positionnement principal : professionnel capable de concevoir et développer des applications web complètes avec Java, Spring Boot, Angular, PostgreSQL, Docker, CI/CD, conception d'API, architecture logicielle, développement frontend, sécurité applicative et DevOps.

## 4. Problème à résoudre

Les informations professionnelles sont souvent dispersées entre CV, LinkedIn, GitHub, plateformes d'emploi, documents PDF, réseaux sociaux et messages privés. Cette dispersion empêche un recruteur, client ou partenaire de comprendre rapidement le profil, les compétences principales, les problèmes que le professionnel peut résoudre, son expérience réelle, la qualité de ses réalisations et la manière de le contacter.

Problèmes secondaires :

- dépendance à un développeur pour modifier le contenu ;
- portfolio obsolète lorsque le contenu est codé en dur ;
- présentation trop générique ;
- absence d'études de cas structurées ;
- difficulté à différencier les compétences réelles des simples listes de technologies ;
- manque de crédibilité visuelle ;
- mauvaise expérience sur mobile ;
- référencement insuffisant ;
- difficulté à mesurer les visites et les prises de contact.

Réponse attendue : centraliser les informations professionnelles dans une expérience claire, crédible, moderne, responsive, accessible, rapide, administrable, multilingue et optimisée SEO.

## 5. Utilisateurs et acteurs connus

### Visiteur public

Recruteur, responsable RH, responsable technique, client potentiel, entreprise, partenaire, membre du réseau professionnel ou personne ayant reçu un lien.

Objectifs : comprendre le profil, identifier les spécialités, consulter expériences et projets, vérifier les technologies maîtrisées, consulter ou télécharger le CV, accéder aux profils professionnels, envoyer un message, demander une collaboration ou contacter directement le propriétaire.

### Administrateur

Le propriétaire du portfolio. Dans le MVP, un seul compte administrateur est nécessaire.

Responsabilités : connexion sécurisée, gestion des contenus, projets, expériences, compétences, services, liens professionnels, messages reçus, SEO, publication/dépublication, ordre d'affichage et prévisualisation.

### Moteurs de recherche

Acteur technique indirect. Le site doit fournir pages indexables, métadonnées cohérentes, URLs propres, sitemap, robots.txt, données structurées pertinentes et contenus descriptifs de qualité.

### Services externes éventuels

Service d'envoi d'e-mails, outil d'analyse d'audience, GitHub, LinkedIn, hébergeur, stockage d'images, service anti-spam. Leur utilisation définitive doit être décidée pendant les phases d'architecture.

## 6. Fonctionnalités envisagées

### Site public

- En-tête avec logo ou monogramme, nom professionnel, navigation principale, bouton de contact, sélecteur de langue, menu mobile, téléchargement CV facultatif.
- Navigation envisagée : Accueil, À propos, Compétences, Expériences, Projets, Services, Contact.
- Hero présentant le nom, titre professionnel, spécialité, proposition de valeur, CTA principal et secondaire, photo ou illustration de qualité, technologies principales et disponibilité si pertinente.
- Indicateurs de crédibilité administrables, sans statistiques fictives.
- Section À propos concrète : parcours, positionnement, motivations, manière de travailler, valeur apportée, objectifs, domaines d'intérêt.
- Compétences par catégories : Backend, Frontend, Base de données, DevOps, Conception. Pas de pourcentages arbitraires.
- Expérience professionnelle en chronologie ou cartes, avec entreprise, poste, contrat, lieu, dates, résumé, missions, réalisations, technologies et lien facultatif.
- Formation, diplômes, formations professionnelles, certifications et parcours d'apprentissage.
- Projets et études de cas avec titre, slug, résumé, description, problème, contexte, objectifs, rôle, responsabilités, solution, architecture, fonctionnalités, technologies, défis, décisions, résultats, médias, liens, statut, dates, type, confidentialité, ordre, mise en avant et publication.
- Page de détail projet : `/projects/:slug`.
- Services proposés : backend Java/Spring Boot, frontend Angular, Full Stack, API REST, architecture, base de données, Docker, CI/CD, audit, maintenance, modernisation, accompagnement numérique.
- Méthode de travail : compréhension du besoin, cadrage, conception, développement, tests, livraison, accompagnement.
- Témoignages masqués tant qu'aucun témoignage réel n'est disponible.
- Appel à collaboration.
- Formulaire de contact avec nom, e-mail, entreprise facultative, sujet, type de demande, message, consentement confidentialité et protection anti-spam.
- Coordonnées et réseaux administrables.
- Pied de page avec nom, résumé, navigation, réseaux, coordonnées, copyright, confidentialité, mentions légales et langue facultative.

### Pages publiques complémentaires

- `/` : landing page principale
- `/projects/:slug` : détail d'un projet
- `/privacy` : politique de confidentialité
- `/legal` : mentions légales
- `/404` : page introuvable
- `/projects` : hors MVP initial, possible si le nombre de projets devient important

### Espace d'administration

Préfixe de routes envisagé : `/admin`.

Fonctionnalités envisagées :

- authentification administrateur : connexion, déconnexion, expiration ou renouvellement de session, changement et récupération de mot de passe, protection des routes, limitation des tentatives, journalisation sensible, pas d'inscription publique, création sécurisée du premier administrateur ;
- tableau de bord : projets publiés, brouillons, messages non lus ou à traiter, sections incomplètes, contenus récents, visites si disponibles, raccourcis ;
- gestion du profil : identité, titre, résumé, bio, photo, localisation, disponibilité, e-mail, téléphone, CV, réseaux, CTA, statistiques professionnelles ;
- gestion des sections : activation, titre, sous-titre, contenu, ordre, prévisualisation ;
- gestion des projets : créer, modifier, supprimer selon règles, archiver, publier, dépublier, dupliquer, mettre en avant, ordonner, médias, technologies, prévisualisation, traductions ; statuts `DRAFT`, `PUBLISHED`, `ARCHIVED` ;
- gestion des expériences, formations, certifications, compétences, services, témoignages ;
- gestion des messages : statuts `NEW`, `READ`, `TO_REPLY`, `REPLIED`, `ARCHIVED`, `SPAM`, lecture, classement, archivage, suppression selon politique, copie des coordonnées, réponse, filtre, recherche ;
- gestion des médias : téléversement, prévisualisation, texte alternatif, renommage sûr, suppression contrôlée, vérification des usages, compression, contrôle format/taille ;
- gestion SEO : titre, description, mots-clés si pertinents, image de partage, Open Graph, métadonnées, slugs, indexation, canonical URL ;
- paramètres généraux : site, logo, favicon, langues, thème, coordonnées, réseaux, e-mail de réception, maintenance, formulaire, pied de page ;
- prévisualisation et publication : brouillon, prévisualisation, publication, dépublication, historique minimal éventuel ;
- journal d'activité : connexion, changement de mot de passe, publication, dépublication, suppression, paramètres, médias.

## 7. Objectif du MVP

Le MVP doit permettre de mettre en ligne un portfolio professionnel réellement utilisable.

Contenu public minimal : en-tête, Hero, À propos, compétences, expériences, projets, services, contact, pied de page, pages légales, page de détail des projets, français/anglais, responsive, accessibilité de base, SEO de base.

Administration minimale : connexion administrateur, gestion profil, compétences, expériences, projets, services, coordonnées, réseaux, messages, médias principaux, publication/dépublication, ordre d'affichage, contenu français/anglais, SEO de base.

Résultat attendu : site public accessible, contenu réel présenté, contenu modifiable sans code, consultation des projets, formulaire de contact fonctionnel, messages consultables dans l'administration, fonctionnement mobile/desktop, niveau SaaS premium, performances acceptables et sécurité principale appliquée.

## 8. Périmètre exclu du MVP

- inscription publique ;
- plusieurs administrateurs et rôles complexes ;
- espace client ou recruteur ;
- réseau social interne ;
- blog complet ;
- newsletter ;
- commentaires ;
- paiement ;
- réservation de rendez-vous intégrée ;
- IA conversationnelle ;
- génération automatique de contenu ;
- gestion avancée de versions ;
- workflow éditorial multi-validateur ;
- application mobile native ;
- microservices ;
- Kubernetes ;
- multi-tenant ;
- marketplace ;
- système de candidature complet ;
- tableau CRM ;
- synchronisation automatique complète LinkedIn/GitHub ;
- thème personnalisable par le visiteur ;
- moteur de recherche avancé ;
- notifications push.

Ces fonctionnalités pourront être analysées ultérieurement mais ne doivent pas être anticipées dans le code sans besoin concret.

## 9. Règles métier connues

### Publication

- Un contenu en brouillon ne doit pas apparaître publiquement.
- Seuls les contenus publiés doivent être visibles.
- Un contenu archivé ne doit plus être affiché publiquement.
- L'ordre des éléments doit être contrôlable depuis l'administration.
- Une section désactivée ne doit pas apparaître publiquement.
- Les modifications non publiées ne doivent pas remplacer automatiquement la version publique si un mécanisme brouillon/publication est retenu.

### Projets

- Chaque projet publié doit posséder un titre, un slug unique, un résumé et une image de couverture ou un visuel de remplacement.
- Un lien GitHub ou de démonstration n'est pas obligatoire.
- Les projets confidentiels ne doivent révéler aucune information sensible.
- Les projets mis en avant doivent apparaître avant les projets ordinaires.

### Compétences

- Les compétences doivent appartenir à une catégorie.
- L'ordre d'affichage doit être configurable.
- Les niveaux en pourcentage arbitraire doivent être évités.
- Une compétence non publiée ne doit pas apparaître sur le site.

### Expériences

- Une expérience en cours peut ne pas avoir de date de fin.
- Les expériences doivent être triées de la plus récente à la plus ancienne, sauf ordre manuel explicite.
- Les informations confidentielles ne doivent pas être publiées.

### Messages

- Chaque message doit posséder un statut.
- Un nouveau message doit être marqué comme non lu.
- Les données du formulaire doivent être validées côté backend.
- Les messages suspects doivent pouvoir être classés comme spam.
- Les messages ne doivent pas être exposés publiquement.
- La durée de conservation doit être définie dans la politique de confidentialité.

### Médias

- Les formats autorisés doivent être limités.
- La taille maximale doit être contrôlée.
- Les fichiers doivent être renommés de manière sûre.
- Un média utilisé ne doit pas être supprimé sans avertissement.
- Les textes alternatifs doivent pouvoir être renseignés.
- Les fichiers exécutables doivent être refusés.

### Langues

- Le français est la langue par défaut.
- L'anglais est la deuxième langue du MVP.
- Les contenus traduisibles doivent être gérés séparément.
- Une traduction absente doit suivre une stratégie documentée.
- L'administration peut être initialement en français mais doit rester compatible i18n.

### Administration

- Aucun utilisateur public ne peut accéder à l'administration.
- Les routes administratives doivent être protégées.
- Les autorisations doivent être vérifiées côté backend.
- La déconnexion doit invalider ou rendre inutilisable la session selon le mécanisme retenu.
- Les opérations sensibles doivent être journalisées.

## 10. Contraintes

### Budget

Budget limité pour le MVP. Privilégier les solutions open source et services avec offre gratuite adaptée. Éviter toute infrastructure complexe ou coûteuse sans justification.

### Délai

À déterminer après cadrage, architecture et découpage MVP. Le planning doit privilégier des vertical slices fonctionnelles.

### Pays ou marché

Cameroun, Afrique francophone, Europe et marché international pour les contenus anglais. Le site doit rester utilisable avec une connexion internet limitée.

### Contraintes légales

Politique de confidentialité, mentions légales, consentement du formulaire, durée de conservation des messages, données personnelles, analyse d'audience légitime, droits sur images/logos/captures, confidentialité des projets clients.

### Contraintes de sécurité

Aucun secret dans le dépôt, mots de passe hachés, authentification sécurisée, limitation des tentatives, contrôle des fichiers, validation backend, protection des routes, autorisations backend, prévention des injections, protection contre contenus malveillants, sessions ou jetons sûrs, logs sans données sensibles, configuration par environnement, sauvegarde PostgreSQL, dépendances vérifiées.

### Contraintes de performance

Chargement rapide, images limitées et optimisées, lazy loading, dépendances maîtrisées, fonctionnement mobile, nombre de requêtes limité, polices optimisées, formats modernes si possible.

### Contraintes d'accessibilité

Navigation clavier, focus visible, contrastes suffisants, labels associés, textes alternatifs, structure sémantique, messages d'erreur compréhensibles, modales et menus accessibles, absence de dépendance exclusive à la couleur.

## 11. Stack technique

### Frontend

- Angular 20 ou version stable compatible
- TypeScript strict
- Composants standalone
- Fonctionnement zoneless
- Rendu côté client
- SCSS
- Tailwind CSS
- PrimeNG
- ngx-translate
- Formulaires réactifs typés
- Lazy loading
- Architecture organisée par fonctionnalités
- Tests frontend
- Responsive design
- Accessibilité

### Responsabilités visuelles

- Tailwind CSS : layouts, grilles, flex, espacements, responsive, utilitaires.
- PrimeNG : tableaux administratifs, dialogues, menus, formulaires avancés, listes, composants interactifs.
- SCSS : design tokens, thèmes, animations, composants spécifiques, intégration PrimeNG, styles difficiles à exprimer proprement en utilitaires.

### Backend

- Java 21
- Spring Boot 4 ou version stable compatible
- Spring Security
- Spring Data JPA
- Bean Validation
- API REST
- PostgreSQL
- Migrations de base de données
- Architecture organisée par domaines ou fonctionnalités
- Tests unitaires
- Tests d'intégration
- Docker Compose
- Collection Postman
- Documentation API

### Base de données

PostgreSQL.

Ressources envisagées : utilisateur administrateur, profil, section, contenu traduit, compétence, catégorie de compétence, expérience, formation, certification, projet, technologie, média, service, témoignage, message de contact, lien social, paramètre SEO, paramètre général, journal d'activité.

Le modèle définitif doit être établi par les agents Product, Architecte, Backend et Database.

### Infrastructure

Docker, Docker Compose, variables d'environnement, health checks, logs structurés, pipeline CI/CD adapté, sauvegarde PostgreSQL, environnements local/test/production.

### Hébergement

À déterminer pendant l'architecture selon coût, simplicité, Docker, PostgreSQL, stockage médias, sauvegardes, domaine personnalisé, HTTPS, déploiement automatisé et localisation éventuelle des données.

## 12. Projet existant

**État connu :** Aucun code applicatif existant. Le projet doit être créé à partir de zéro.

**Fonctionnalités existantes :** Aucune.

**Problèmes connus :** Aucun problème technique existant. Les risques principaux concernent le scope, la qualité des contenus, la performance des médias, la sécurité de l'administration et la cohérence visuelle.

**Éléments à préserver :** Aucun code existant à préserver. Les décisions consignées dans ce `PROJECT_BRIEF.md` doivent être respectées.

## 13. Priorités

1. Qualité professionnelle montrable à recruteurs, entreprises, clients, partenaires et responsables techniques.
2. UX/UI SaaS premium pour le site public et l'administration.
3. Code frontend senior : typé, organisé, testable, accessible, performant, maintenable, Angular moderne.
4. Code backend senior : organisé, sécurisé, testable, transactionnel, documenté, maintenable, cohérent métier.
5. Administration simple permettant au propriétaire de maintenir le contenu sans code.
6. Performance de la landing page malgré images, projets, animations et contenus multilingues.
7. Référencement exploitable pour candidatures et démarches commerciales.
8. Sécurité de l'administration, des messages et des médias.

## 14. Consignes particulières

### Style visuel

Design moderne, professionnel, premium, sobre, distinctif, élégant et adapté au secteur technologique. Éviter le style template gratuit générique, les dégradés excessifs, les animations inutiles, les cartes partout, les jauges artificielles, les textes trop longs dans le Hero, les effets réduisant la lisibilité et les administrations vieillissantes.

Références qualitatives possibles, sans copie : Linear, Stripe, Notion, Framer, Vercel, portfolios de studios logiciels premium.

### Identité visuelle provisoire

À concevoir pendant la phase UX/UI. Orientation initiale possible : base sombre ou claire sobre, couleur d'accent professionnelle, typographie moderne, grandes zones de respiration, rayons modérés, animations discrètes, motifs technologiques subtils. Aucune palette définitive avant validation UX/UI.

### Animations

Discrètes, utiles à la compréhension, respectueuses de la réduction de mouvement, sans ralentir la page ni gêner la lecture.

### Contenu réel

Utiliser des contenus réels ou clairement identifiés comme exemples. Ne pas inventer clients, témoignages, statistiques, certifications, expériences ou résultats chiffrés.

### Images et médias

Optimisés, légalement utilisables, avec texte alternatif, adaptés aux écrans, sans informations confidentielles, secrets ou données personnelles visibles.

### Administration

Administration conçue comme un produit professionnel, pas un CRUD brut : navigation claire, dashboard utile, formulaires cohérents, confirmations, filtres, recherche si pertinente, états complets, sauvegarde, publication, prévisualisation, responsive raisonnable.

### Documentation

Documenter lancement local, variables d'environnement, structure, API, modèle de données, authentification, déploiement, sauvegarde, restauration, médias et création du premier administrateur.

## 15. Autorisation initiale

Valeurs possibles : `AUDIT_UNIQUEMENT` | `CADRAGE_PRODUIT` | `INITIALISATION_DU_FRAMEWORK`

**Valeur :** `INITIALISATION_DU_FRAMEWORK`

Cette autorisation permet uniquement d'installer l'entreprise virtuelle, analyser ce brief, préparer les documents du projet, préparer le plan initial, identifier hypothèses et risques, proposer les phases, réaliser l'audit initial et s'arrêter.

Cette autorisation ne permet pas de générer l'application Angular, générer le backend Spring Boot, créer la base de données, implémenter l'authentification, la landing page ou l'administration, lancer une phase métier, ou faire un commit.

Statut attendu après l'initialisation : `INITIALISATION_CLÔTURÉE_EN_ATTENTE_DU_GO_HUMAIN`.

## 16. Critères de succès du produit

- Un visiteur comprend le profil en moins d'une minute.
- Les compétences principales sont immédiatement identifiables.
- Les projets démontrent des compétences concrètes.
- Le site fonctionne correctement sur mobile et desktop.
- Le site présente un niveau visuel professionnel.
- Les pages publiques sont accessibles et rapides.
- Le formulaire de contact fonctionne.
- Les messages apparaissent dans l'administration.
- Le contenu peut être modifié sans changer le code.
- Les contenus peuvent être publiés ou dépubliés.
- Le français et l'anglais sont supportés.
- Les métadonnées SEO sont configurables.
- L'administration est sécurisée.
- Le frontend et le backend passent leurs gates de qualité.
- Les tests critiques sont présents.
- Le déploiement est documenté.
- Aucun contenu fictif trompeur n'est publié.

## 17. Risques initiaux

1. Scope trop large : risque de CMS générique. Réponse : maintenir le MVP, YAGNI, GO par phase.
2. Contenu insuffisant : un bon design ne compense pas les contenus faibles. Réponse : préparer des contenus réels et études de cas.
3. Design générique : risque de template standard. Réponse : identité visuelle, validation UX/UI, inspection visuelle, gate SaaS premium.
4. Administration surdimensionnée : réponse : un seul administrateur, pas de rôles complexes, fonctions centrées portfolio, monolithe modulaire.
5. Médias trop lourds : réponse : compression, formats modernes, dimensions adaptées, lazy loading, limites de taille.
6. Spam : réponse : validation, limitation de fréquence, honeypot ou anti-spam, journalisation, classement spam.
7. Sécurité de l'administration : réponse : auth sécurisée, mot de passe robuste, limitation des tentatives, sessions, journalisation, HTTPS, récupération contrôlée.
8. Sur-ingénierie : réponse : KISS, YAGNI, Reviewer, pas d'amélioration framework sans dysfonctionnement, pas de hors-périmètre.

## 18. Hypothèses initiales

- Le portfolio appartient à une seule personne.
- Un seul administrateur est nécessaire.
- Le français est la langue principale.
- L'anglais doit être disponible dans le MVP.
- Aucun blog n'est requis dans le MVP.
- Aucun paiement n'est nécessaire.
- Les projets seront ajoutés manuellement.
- Les témoignages seront désactivés en l'absence de témoignages réels.
- Le CV sera fourni en PDF.
- Les images seront stockées localement ou dans un stockage compatible selon l'hébergement retenu.
- Le formulaire de contact enverra une notification par e-mail.
- Le site public utilisera le rendu côté client sauf décision architecturale contraire.
- Le SEO devra être adapté aux capacités réelles de l'architecture Angular retenue.
- L'espace admin ne nécessitera pas une gestion complexe des rôles.

Ces hypothèses ne sont pas des décisions définitives.

## 19. Premières données à préparer

Profil : photo, titre, résumé, biographie, localisation, disponibilité, coordonnées, CV, liens professionnels.

Expériences : entreprise, poste, dates, missions, réalisations, technologies, éléments publiables.

Projets : titre, résumé, contexte, problème, solution, rôle, technologies, fonctionnalités, défis, résultats, captures, liens, contraintes de confidentialité.

Compétences : catégories, compétences réelles, descriptions, niveau de maîtrise qualitatif.

Services : services réellement proposés, bénéfices, livrables, types de clients visés.

Identité : logo ou monogramme, palette, typographies, style photographique, ton rédactionnel.

## 20. Résultat attendu de l'initialisation

À partir de ce brief, l'entreprise virtuelle doit analyser le besoin, identifier les contradictions, préparer `PROJECT.md`, `PLANS.md`, les documents produit, exigences fonctionnelles et non fonctionnelles, ADR nécessaires, risques, état projet, gates humains, découpage des phases, audit d'initialisation, puis s'arrêter en attente du GO humain.

Aucune fonctionnalité applicative ne doit être implémentée pendant cette initialisation.

Les champs encore provisoires concernent principalement le domaine, les contenus réels, l'identité visuelle et l'hébergement. Le framework peut les traiter comme des hypothèses durant le cadrage, sans les inventer comme faits.
