# ADR-0002 — Stratégie de rendu public Angular

## Statut

Accepté

## Date

2026-07-21

## Contexte

Le portfolio doit être indexable, rapide et administrable. Les contenus publics peuvent changer depuis l'administration.

## Problème

Un rendu client pur simplifie l'hébergement mais affaiblit le SEO. Un prérendu statique simplifie le SEO mais ne reflète pas les changements admin sans rebuild. Un SSR complet ajoute un service Node mais sert les contenus dynamiques.

## Contraintes

- SEO public important.
- Contenus administrables.
- Budget limité.
- Admin non indexable.

## Options considérées

- CSR uniquement.
- Prérendu statique.
- SSR Angular pour routes publiques, admin CSR.

## Décision

Utiliser Angular SSR pour les routes publiques dynamiques à enjeu SEO et garder l'administration en CSR protégée. Les pages statiques légales peuvent être prérendues si cela reste simple.

## Justification

SSR répond mieux au couple SEO + contenus administrables. Le prérendu seul créerait un risque de contenu public obsolète après modification admin.

## Conséquences positives

- Meilleure indexabilité.
- Métadonnées publiques servies au premier rendu.
- Admin isolée du besoin SEO.

## Conséquences négatives

- Complexité d'exploitation supérieure au CSR pur.
- Besoin d'un conteneur frontend SSR.

## Risques

- Surcoût opérationnel si l'hébergement choisi supporte mal Node SSR.

## Impacts sécurité

L'admin reste privée et non indexable. Les endpoints SSR ne doivent exposer que données publiques filtrées.

## Impacts données

Les métadonnées SEO et contenus publiés doivent être accessibles via API publique.

## Migration

À implémenter en Phase 3/4 lors du bootstrap Angular.

## Rollback

Retour possible vers CSR avec risque SEO documenté et nouvel ADR.

## ADR remplacé ou lié

Lié : ADR-0001, ADR-0008.
