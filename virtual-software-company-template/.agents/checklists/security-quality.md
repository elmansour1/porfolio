# Checklist qualité sécurité

| Critère | Résultat | Commentaire |
|---------|----------|-------------|
| Authentification | PASS/FAIL | Mécanisme robuste, expiration, révocation |
| Autorisation | PASS/FAIL | Moindre privilège, contrôle serveur |
| Validation des entrées | PASS/FAIL | Toutes les entrées validées côté serveur |
| Protection mots de passe | PASS/FAIL | Hachage, pas de stockage en clair |
| Données sensibles | PASS/FAIL | Pas dans les logs, pas dans le dépôt |
| Secrets | PASS/FAIL | Variables d'environnement, pas dans le code |
| Gestion sessions/jetons | PASS/FAIL | Expiration, révocation, stockage prudent |
| Journalisation | PASS/FAIL | Opérations sensibles journalisées, pas de données sensibles dans les logs |
| Protection fichiers | PASS/FAIL | Upload contrôlé, types vérifiés |
| Opérations admin | PASS/FAIL | Protégées, auditées |
| Dépendances | PASS/FAIL | Pas de vulnérabilités connues critiques |
| Modèle de menaces | PASS/FAIL | À jour pour le périmètre concerné |
| Frontend | PASS/FAIL | Pas de secrets, pas de HTML dynamique non contrôlé |

L'Agent Security peut bloquer une clôture en cas de vulnérabilité critique.
