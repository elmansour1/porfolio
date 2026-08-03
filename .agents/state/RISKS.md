# Registre des risques

## Risques actifs

| ID | Risque | Impact | Probabilité | Mitigation | État |
|----|--------|--------|-------------|------------|------|
| R-002 | Scope trop large, transformation du portfolio en CMS générique | Élevé | Moyenne | Maintenir le MVP, appliquer YAGNI, GO par phase, architecture par ressources portfolio | ACTIF |
| R-003 | Contenu réel insuffisant | Élevé | Moyenne | Préparer profil, expériences, projets, captures, CV et textes réels avant implémentation avancée | ACTIF |
| R-004 | Design générique ou niveau visuel insuffisant | Élevé | Moyenne | Phase UX/UI dédiée réalisée ; correction formulaires 2026-08-02 exécutée avec inspection Chrome headless ; maintenir gate SaaS premium sur chaque nouveau formulaire | ACTIF |
| R-005 | Administration surdimensionnée | Moyen | Moyenne | Un seul administrateur, pas de rôles complexes, fonctionnalités centrées portfolio | ACTIF |
| R-006 | Médias trop lourds | Moyen | Moyenne | ADR-0005 : whitelist, taille max à fixer, compression, lazy loading, volume persistant | ACTIF |
| R-007 | Spam via formulaire de contact | Moyen | Moyenne | ADR-0006 : validation, rate limiting, honeypot, délai minimal, statut spam | ACTIF |
| R-008 | Compromission de l'administration | Élevé | Moyenne | ADR-0003 : session serveur, cookie sécurisé, CSRF, limitation tentatives, journalisation | ACTIF |
| R-009 | Sur-ingénierie technique | Élevé | Moyenne | ADR-0001 : monolithe modulaire, pas de microservices/Kubernetes/multi-tenant | ACTIF |
| R-010 | Écart entre conception UX et rendu réel | Moyen | Moyenne | Handoff frontend détaillé, inspection visuelle obligatoire, screenshots responsive et audit UX/UI avant clôture frontend ; captures formulaires dans `/tmp/portfolio-form-inspection` | ACTIF |
| R-012 | Vulnérabilités modérées dans le tooling Angular CLI | Moyen | Moyenne | Suivre correctif Angular 20 ou décider migration Angular CLI 21 par ADR avant adoption | ACTIF |
| R-013 | Canal de remise du jeton de reset non choisi pour production | Moyen | Moyenne | ADR-0011 : jeton non exposé par défaut, livraison out-of-band contrôlée ou future intégration e-mail avant production | ACTIF |
| R-014 | Tests E2E/accessibilité admin non automatisés | Moyen | Moyenne | Ajouter Playwright ou équivalent avec axe avant release ; correction formulaires validée par Chrome headless DevTools temporaire en attendant un harnais permanent | ACTIF |
| R-016 | Stockage médias filesystem à dimensionner avant production | Moyen | Moyenne | Configurer `MEDIA_STORAGE_PATH`, sauvegarde du volume, limites de taille et restauration avant release | ACTIF |
| R-018 | Mot de passe du compte admin Docker existant inconnu | Moyen | Moyenne | Demander au propriétaire le mot de passe actuel ou autorisation explicite de réinitialiser le volume/compte admin avant inspection complète des écrans authentifiés | ACTIF |
| R-019 | Validation visuelle interactive non exécutée pour la sous-phase 5.6 (aucun navigateur/outil de capture disponible) | Moyen | Moyenne | Réaliser une inspection visuelle réelle (desktop/tablette/mobile) du module projets avant mise en production | ACTIF |
| R-020 | Inspection visuelle admin authentifiée 5.7 non capturée | Moyen | Moyenne | Installer un harnais Playwright/axe avec login admin pour inspecter `/admin/services`, les modales et les onglets avant release | ACTIF |
| R-021 | Landing 5.8 validée visuellement sans profil publié réel | Moyen | Moyenne | Publier un profil réel de test/production et refaire captures desktop/tablette/mobile de toutes les sections avant mise en ligne | ACTIF |

## Risques clos

| ID | Risque | Date clôture | Résolution |
|----|--------|--------------|------------|
| R-001 | Le template exportable pouvait transporter l'état et les dates du projet courant | 2026-07-21 | Fichiers projet du template neutralisés et modèles `.agents/state/*` ajoutés |
| R-011 | Build Docker non vérifié dans l'environnement courant | 2026-07-21 | `docker compose build` exécuté avec succès en sous-phase 5.1 pour `portfolio-api` et `portfolio-web` |
| R-015 | Rechargement direct des routes admin via serveur SSR/dev proxy renvoyait au login | 2026-07-22 | Routes `/admin/**` passées en `RenderMode.Client` et proxy `/api` ajouté au serveur Express SSR web |
| R-017 | Inspection runtime 5.4 non exécutée dans l'environnement courant | 2026-07-26 | Runtime Docker validé pendant 5.5 : API/web/postgres healthy, routes admin/public 200, captures headless public/login réalisées |

## Dernière mise à jour

2026-08-03 (ajout R-021 — sous-phase 5.8)
