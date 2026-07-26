# Rollback

## Statut

Validé en Phase 2 — Architecture et conception.

## Principe

Chaque livraison doit pouvoir revenir à la version applicative précédente lorsque les migrations et données le permettent.

## Avant déploiement

- Identifier la version précédente.
- Sauvegarder PostgreSQL si migration appliquée.
- Sauvegarder ou synchroniser les médias.
- Vérifier les variables d'environnement.
- Vérifier le plan de migration.

## Procédure cible

1. Mettre l'application en maintenance si nécessaire.
2. Restaurer l'image ou l'archive applicative précédente.
3. Restaurer la base si migration incompatible.
4. Restaurer les médias si nécessaire.
5. Redémarrer les services.
6. Exécuter les smoke tests.
7. Vérifier logs et health checks.

## Smoke tests rollback

- Site public accessible.
- Page projet publiée accessible.
- Login admin possible.
- Messages admin visibles.
- Médias principaux servis.

## Dernière mise à jour

2026-07-21
