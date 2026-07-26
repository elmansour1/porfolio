# Checklist qualité base de données

| Critère | Résultat | Commentaire |
|---------|----------|-------------|
| Modèle cohérent | PASS/FAIL | Entités, relations, cardinalités explicites |
| Contraintes d'intégrité | PASS/FAIL | Clés étrangères, unicité, NOT NULL |
| Index justifiés | PASS/FAIL | Index sur colonnes de recherche/jointure fréquentes |
| Migrations versionnées | PASS/FAIL | Pas de modification manuelle non tracée |
| Politique de suppression | PASS/FAIL | Soft delete ou cascade documentée |
| Dates et fuseaux | PASS/FAIL | Cohérence des types et fuseaux |
| Performance requêtes | PASS/FAIL | Pas de N+1, requêtes critiques analysées |
| Rollback possible | PASS/FAIL | Migration réversible ou plan de rollback |
| Sauvegarde avant migration risquée | PASS/FAIL/NOT APPLICABLE | |
| Entités séparées des DTO API | PASS/FAIL | Pas d'exposition directe |
