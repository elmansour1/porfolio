# Modèle de menaces

## Statut

Validé en Phase 2 — Architecture et conception. À réauditer à chaque implémentation sécurité.

## Périmètre

- Site public.
- Formulaire de contact.
- Espace d'administration.
- API backend.
- Base PostgreSQL.
- Médias téléversés.
- Notifications e-mail.
- Logs et journal d'activité.
- Déploiement Docker Compose.

## Actifs à protéger

- Compte administrateur.
- Sessions.
- Messages de contact et données personnelles.
- Médias téléversés.
- Contenus brouillons ou archivés.
- Paramètres SEO et généraux.
- Base de données.
- Secrets d'environnement.
- Journal d'activité.

## Menaces

| ID | Menace | Impact | Mitigation retenue | Statut |
|----|--------|--------|--------------------|--------|
| T-001 | Compromission du compte administrateur | Contrôle des contenus, messages, SEO, médias | Session serveur, mot de passe robuste, limitation tentatives, journalisation | Testé Phase 5.1 |
| T-002 | Accès public à l'administration | Fuite ou modification de données | Auth backend sur `/api/v1/admin/**`, CSRF, guards frontend UX | Testé Phase 5.1 |
| T-003 | Spam formulaire | Bruit opérationnel, coûts e-mail | Validation, honeypot, délai minimal, rate limiting, statut spam | À tester |
| T-004 | Upload malveillant | XSS, stockage dangereux, pollution serveur | Whitelist, MIME, taille, dimensions, refus SVG/exécutables, renommage | À tester |
| T-005 | Exposition de projets confidentiels | Atteinte confidentialité | Champs confidentialité, règles de publication, revue contenu | À tester |
| T-006 | XSS via contenu administré | Compromission visiteurs/admin | Échappement par défaut, sanitization ciblée, pas de HTML arbitraire | À tester |
| T-007 | Secrets dans dépôt/logs | Compromission infrastructure | Variables d'environnement, logs filtrés, fichiers exemples sans secret | À tester |
| T-008 | Suppression média utilisé | Contenus cassés | Vérification usages, blocage ou confirmation | À tester |
| T-009 | Conservation indéfinie messages | Risque légal/confidentialité | Durée de conservation et purge/archivage à définir | À décider avant release |
| T-010 | Traduction absente mal gérée | Publication incohérente | Publication par langue selon ADR-0004 | À tester |
| T-011 | Métadonnées SEO abusives | Image publique dégradée, injection | Validation, échappement, journalisation | À tester |
| T-012 | Échec e-mail après contact | Message perdu ou faux succès | Stocker avant notification, journaliser échec e-mail | À tester |
| T-013 | Énumération du compte via reset mot de passe | Ciblage du compte admin | Réponse reset générique, journalisation sans token, token exposable seulement par configuration locale/test | Testé Phase 5.1 |
| T-014 | Vol ou réutilisation du jeton reset | Prise de contrôle du compte | Jeton aléatoire, haché en base, usage unique, expiration courte | Testé Phase 5.1 |
| T-015 | Exposition publique de services brouillons ou CTA malveillant | Atteinte crédibilité, fuite de contenu non publié, redirection dangereuse | Filtrage `PUBLISHED`, archivage retirant la mise en avant, validation CTA/URL côté backend, échappement Angular | Testé Phase 5.7 |

## Dernière mise à jour

2026-08-03
