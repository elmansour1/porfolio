# Flux de données

## Statut

Validé en Phase 2 — Architecture et conception.

## Consultation publique

```text
Visiteur
  -> Angular public SSR/prérendu
  -> API publique Spring Boot
  -> Services de lecture publique
  -> PostgreSQL
  -> Réponse filtrée par statut, langue et confidentialité
```

Règles :

- seules les ressources `PUBLISHED` sont retournées ;
- les ressources `ARCHIVED` ou `DRAFT` sont exclues ;
- les sections désactivées sont exclues ;
- la langue demandée doit posséder une traduction publiée selon ADR-0004.

## Administration

```text
Administrateur
  -> Angular admin CSR
  -> Feature API service typé
  -> DTO frontend models/dto
  -> API admin protégée
  -> DTO backend api.dto.request
  -> Services applicatifs transactionnels
  -> Mappers application.mapper lorsque nécessaire
  -> Modèles domain.model + repositories infrastructure.persistence
  -> PostgreSQL + stockage médias
  -> Journal d'activité
  -> DTO backend api.dto.response
```

Règles :

- toutes les écritures admin exigent session valide et protection CSRF ;
- les opérations sensibles alimentent le journal d'activité ;
- la sauvegarde ne publie pas automatiquement si le contenu reste en brouillon.

## Contact

```text
Visiteur
  -> Formulaire contact
  -> Validation frontend
  -> API contact
  -> Validation backend + anti-spam minimal
  -> Stockage message NEW
  -> Tentative notification e-mail
```

Règle importante : le stockage du message prime. Un échec d'e-mail ne doit pas perdre le message ; il doit être journalisé et visible comme événement opérationnel.

## Médias

```text
Admin
  -> Upload
  -> Validation taille/format/MIME
  -> Renommage sûr
  -> Stockage filesystem persistant
  -> Métadonnées PostgreSQL
  -> Association au contenu
```

Règles :

- les fichiers exécutables et SVG uploadés sont refusés dans le MVP ;
- la suppression vérifie les usages ;
- un média utilisé exige confirmation explicite ou blocage selon la règle de suppression retenue.

## SEO

```text
Admin SEO
  -> Métadonnées
  -> API publique
  -> SSR/prérendu
  -> balises title/meta/Open Graph/canonical
  -> sitemap et robots.txt
```

## Dernière mise à jour

2026-07-26
