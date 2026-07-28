# Exigences de sécurité

## Statut

Validé en Phase 2 — Architecture et conception. Authentification administrateur implémentée en sous-phase 5.1. Profil, paramètres et médias principaux sécurisés en sous-phase 5.3. Compétences/catégories sécurisées en sous-phase 5.4.

## Authentification administrateur

- Session serveur Spring Security.
- Cookie `HttpOnly`, `Secure` en production, `SameSite=Lax` ou `Strict`.
- Protection CSRF active pour les écritures admin.
- Logout invalidant la session serveur.
- Expiration d'inactivité gérée par session serveur ; valeur opérationnelle à fixer par environnement avant production.
- Pas de JWT stocké dans `localStorage`.
- Aucun endpoint d'inscription publique.

## Premier administrateur

- Création par commande serveur contrôlée et idempotente si aucun administrateur n'existe.
- Identifiants initiaux fournis par variables d'environnement `ADMIN_BOOTSTRAP_EMAIL` et `ADMIN_BOOTSTRAP_PASSWORD`.
- Aucun secret initial dans le dépôt.
- Changement de mot de passe obligatoire si un mot de passe temporaire est utilisé.

## Mots de passe

- Longueur minimale : 12 caractères.
- Exigences Phase 5.1 : majuscule, minuscule, chiffre et symbole.
- Hachage robuste : BCrypt coût 12.
- Récupération par jeton aléatoire à usage unique, expirant, stocké haché.
- En production, le jeton de réinitialisation ne doit pas être exposé dans la réponse API.

## Limitation des tentatives

- Les échecs de connexion sont suivis par e-mail normalisé.
- Par défaut : 5 échecs puis verrouillage 15 minutes.
- Les paramètres sont configurables par `AUTH_LOGIN_MAX_FAILURES` et `AUTH_LOGIN_LOCK_DURATION`.
- Les réponses restent génériques.

## Autorisations

- Toutes les API `/api/v1/admin/**` vérifient l'authentification côté backend.
- Le frontend admin ne constitue pas une frontière de sécurité.
- Les API publiques ne retournent jamais brouillons, archives, messages, logs ou paramètres sensibles.
- Les coordonnées du profil ne sont retournées publiquement que si les visibilités globales et locales sont activées.
- L'email de réception interne des contacts n'est jamais retourné par l'API publique.
- Les API publiques compétences ne retournent que catégories et compétences publiées, visibles et traduites.
- Les opérations d'écriture compétences/catégories sont réservées aux routes `/api/v1/admin/**`, exigent session admin et CSRF.
- Les valeurs issues des sélections frontend, notamment statut, niveau et catégorie, sont validées côté backend.

## Formulaire de contact

- Validation backend obligatoire.
- Honeypot.
- Délai minimal de soumission.
- Rate limiting par IP et éventuellement par e-mail.
- Taille maximale du message.
- Statut `SPAM`.
- Journalisation sans contenu sensible complet.

## Médias

- Whitelist stricte.
- Images autorisées MVP : `jpg`, `jpeg`, `png`, `webp`, `avif` si support retenu.
- CV : PDF uniquement.
- SVG uploadé refusé dans le MVP sauf sanitization explicitement décidée.
- Exécutables, archives, HTML et scripts refusés.
- Contrôle extension, MIME réel, taille et dimensions.
- Nom de fichier aléatoire côté stockage.
- Stockage hors chemin exécutable.
- Texte alternatif requis pour médias publiés pertinents.
- Vérification des usages avant suppression.
- Phase 5.3 : la suppression photo/CV/logo/favicon est limitée aux endpoints dédiés et ne crée pas de médiathèque complète.
- Les fichiers remplacés sont supprimés du stockage lorsque possible ; l'échec de suppression physique ne bloque pas la suppression des métadonnées et doit être traité par nettoyage opérationnel.

## Logs et données sensibles

Ne jamais logger :

- mots de passe ;
- tokens, cookies, sessions ;
- secrets ;
- contenu complet des messages ;
- fichiers ;
- données personnelles non nécessaires.

Les journaux d'authentification enregistrent l'action, le résultat, l'utilisateur si connu, l'adresse IP et le user-agent tronqué, sans mot de passe, token ni cookie.

Les journaux Phase 5.3 enregistrent les modifications sensibles de profil, paramètres et médias sans contenu complet, sans fichier et sans données privées inutiles.

Les journaux Phase 5.4 enregistrent les créations, modifications, publications, archivages et suppressions compétences/catégories sans contenu sensible inutile.

## Confidentialité

- Consentement requis avant contact.
- Durée de conservation des messages à fixer avant livraison.
- Politique de suppression ou archivage à documenter.

## Dernière mise à jour

2026-07-26

## Sous-phase 5.5 — Sécurité parcours

- Les endpoints admin du parcours restent sous `/api/v1/admin/**` et exigent authentification + CSRF.
- Les endpoints publics n'exposent ni brouillons, ni archives, ni données confidentielles.
- Les URLs publiques sont validées côté backend.
- Les valeurs de sélection envoyées par le frontend sont validées côté backend via enums/contrats stables.
- La confidentialité d'une expérience masque aussi le lien public de l'organisation.
