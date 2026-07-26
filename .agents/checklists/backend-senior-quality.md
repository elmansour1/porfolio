# Checklist qualité backend senior

| Critère | Résultat | Commentaire |
|---------|----------|-------------|
| Business Compliance | PASS/FAIL | Règles métier correctement implémentées |
| Architecture Compliance | PASS/FAIL | Organisation par domaine, frontières respectées |
| API Contract | PASS/FAIL | DTO entrée/sortie, validation, codes HTTP cohérents |
| Code Readability | PASS/FAIL | Nommage explicite, méthodes raisonnables |
| Separation of Concerns | PASS/FAIL | Contrôleurs minces, logique hors contrôleurs |
| Transactions | PASS/FAIL | Positionnées au bon niveau |
| Validation | PASS/FAIL | Entrées validées côté serveur |
| Error Handling | PASS/FAIL | Catégorisées, pas de catch vides, pas de détails techniques exposés |
| Security | PASS/FAIL | Auth, autorisations, moindre privilège |
| Database Integrity | PASS/FAIL | Contraintes, relations maîtrisées, pas de N+1 |
| Performance | PASS/FAIL | Pagination, pas d'opérations en boucle non maîtrisées |
| Unit Tests | PASS/FAIL | Règles métier testées |
| Integration Tests | PASS/FAIL | Persistance et transactions testées |
| API Tests | PASS/FAIL | Contrats et erreurs testés |
| Migrations | PASS/FAIL/NOT APPLICABLE | Versionnées, rollback possible |
| Build | PASS/FAIL/NOT EXECUTED | |
| Reviewer Verdict | CONFORME/CONFORME AVEC RÉSERVES/NON CONFORME | |
