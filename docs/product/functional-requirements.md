# Exigences fonctionnelles

## Statut

Validé en Phase 1 — Cadrage produit. Profil professionnel et paramètres généraux livrés en sous-phase 5.3. Compétences et catégories livrées en sous-phase 5.4.

## Exigences MVP

| ID | Description | Priorité | Critères d'acceptation |
|----|-------------|----------|------------------------|
| FR-001 | Le site public affiche une landing page structurée avec Hero, À propos, compétences, expériences, projets, services, contact et pied de page | MUST | Un visiteur peut parcourir les sections publiques publiées ; le profil, la spécialité et les CTA sont visibles sur le premier écran |
| FR-002 | Le site public affiche uniquement les contenus publiés et masque brouillons, archives et sections désactivées | MUST | Aucun contenu non publié, archivé ou section désactivée n'est visible publiquement |
| FR-003 | Chaque projet publié important dispose d'une page de détail `/projects/:slug` | MUST | Un projet publié avec slug unique est consultable ; un slug inconnu retourne une page introuvable propre |
| FR-004 | Le portfolio supporte le français et l'anglais pour les contenus du MVP | MUST | Le visiteur peut basculer entre les langues ; la stratégie de traduction absente est appliquée |
| FR-005 | Le formulaire de contact collecte nom, e-mail, sujet, type de demande, message et consentement | MUST | Les entrées sont validées ; le consentement est requis ; les doubles soumissions sont bloquées ; un message valide est transmis au backend |
| FR-006 | Les messages de contact sont enregistrés et consultables dans l'administration | MUST | L'administrateur voit les nouveaux messages avec statut `NEW` et peut changer leur statut |
| FR-007 | L'administration est accessible uniquement à l'administrateur authentifié | MUST | Les routes et API admin refusent tout accès non authentifié |
| FR-008 | L'administrateur peut gérer profil, coordonnées, réseaux et CV | MUST | Les modifications sauvegardées alimentent le site public selon publication et langue |
| FR-009 | L'administrateur peut gérer compétences, catégories et ordre d'affichage | MUST | Les compétences publiées apparaissent dans l'ordre configuré et sans pourcentage arbitraire |
| FR-010 | L'administrateur peut gérer expériences, dates, missions et technologies | MUST | Les expériences publiées apparaissent selon la règle de tri retenue ; les informations confidentielles restent exclues |
| FR-011 | L'administrateur peut gérer projets, médias, technologies, statut, mise en avant et ordre | MUST | Les projets publiés apparaissent publiquement ; les brouillons non ; les projets mis en avant précèdent les autres |
| FR-012 | L'administrateur peut gérer services et leur activation/publication | MUST | Les services publiés sont visibles ; les services désactivés ne le sont pas |
| FR-013 | L'administrateur peut gérer les médias principaux avec texte alternatif | MUST | Les médias invalides sont refusés ; les médias utilisés ne peuvent pas être supprimés sans avertissement ; un alt est disponible lorsque pertinent |
| FR-014 | L'administrateur peut gérer les métadonnées SEO de base | MUST | Les pages publiques exposent titre, description et métadonnées sociales compatibles avec la stratégie de rendu retenue |
| FR-015 | Le système journalise les opérations sensibles minimales | MUST | Connexions, publications, dépublications, suppressions et opérations médias sont tracées sans donnée sensible inutile |
| FR-016 | Les témoignages restent masqués tant qu'aucun témoignage réel n'est publié | MUST | Aucune section de faux témoignage n'apparaît publiquement |
| FR-017 | L'administrateur peut prévisualiser les modifications clés avant publication lorsque le modèle retenu le permet | SHOULD | Une modification peut être vérifiée sans devenir automatiquement publique |
| FR-018 | Le tableau de bord admin présente les indicateurs opérationnels utiles | SHOULD | Messages non lus, contenus incomplets et raccourcis principaux sont visibles si les données existent |

## Avancement implémentation

| ID | Statut | Commentaire |
|----|--------|-------------|
| FR-007 | Partiellement livré | Authentification admin et protection des routes/endpoints livrées en 5.1 ; rôles complexes exclus du MVP. |
| FR-008 | Livré en 5.3 | Profil, coordonnées, réseaux, CV, photo, traductions, statistiques réelles et visibilité publique sont administrables. |
| FR-009 | Livré en 5.4 | Catégories et compétences administrables, traduisibles, ordonnables, publiables, archivables, sans pourcentages arbitraires. |
| FR-013 | Partiellement livré | Médias principaux profil/paramètres livrés ; médiathèque complète hors périmètre. |
| FR-015 | Partiellement livré | Authentification, profil, paramètres, médias sensibles et modifications compétences/catégories journalisés ; autres contenus à venir. |

## Règles métier clés

- Brouillon et archive ne sont pas publics.
- Slug projet unique requis pour projet publié.
- Projet publié : titre, résumé et image de couverture ou visuel de remplacement requis.
- Compétence rattachée à une catégorie.
- Pas de niveaux de compétence en pourcentages arbitraires.
- Nouveau message marqué non lu.
- Fichiers exécutables refusés.
- Contenus confidentiels non publiés.
- Témoignages, statistiques, clients et résultats chiffrés ne sont affichés que s'ils sont réels.

## Questions métier à décider en Phase 2

| ID | Sujet | Options à trancher | Impact |
|----|-------|--------------------|--------|
| Q-001 | Traduction absente | Masquer, fallback français, bloquer publication | i18n, publication, UX |
| Q-002 | Modèle de publication | Statut simple ou brouillon/version publiée séparés | Données, admin, prévisualisation |
| Q-003 | Suppression | Suppression définitive, archivage, blocage si utilisé | Données, audit, UX admin |
| Q-004 | Médias | Formats, taille maximale, dimensions, stockage | Sécurité, performance |
| Q-005 | Messages | Conservation, suppression, export éventuel | Confidentialité, juridique |
| Q-006 | Projets confidentiels | Critères publiables/non publiables | Métier, sécurité |
| Q-007 | Compétences | Niveaux qualitatifs possibles | UX, contenu |
| Q-008 | Expériences | Tri chronologique ou ordre manuel prioritaire | UX, admin |
| Q-009 | Premier administrateur | Script, variable initiale, commande sécurisée | Sécurité, opérations |
| Q-010 | Récupération mot de passe | MVP automatisé ou procédure manuelle sécurisée | Sécurité, UX admin |

## Dernière mise à jour

2026-07-26

## Sous-phase 5.5 — Exigences livrées

- Gestion admin des expériences professionnelles, formations et certifications.
- Traductions FR/EN des contenus éditoriaux du parcours.
- Publication, archivage, ordre et visibilité publique.
- Règles de confidentialité pour les expériences.
- Association des expériences aux compétences existantes.
- Section publique parcours affichant uniquement les contenus publiés.

Exclusions maintenues :

- Projets, services, témoignages, contact, messages et médiathèque complète.
