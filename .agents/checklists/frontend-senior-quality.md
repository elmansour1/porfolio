# Checklist qualité frontend senior

| Critère | Résultat | Commentaire |
|---------|----------|-------------|
| Frontend Architecture | PASS/FAIL | Organisation par domaine, composants page/présentation |
| TypeScript Strictness | PASS/FAIL | Pas de `any`, types explicites |
| Component Responsibilities | PASS/FAIL | Responsabilité unique, taille raisonnable |
| State Management | PASS/FAIL | Pas de duplication, source de vérité unique |
| RxJS/Signals Usage | PASS/FAIL | Pas de subscriptions imbriquées, nettoyage |
| API Integration | PASS/FAIL | Appels centralisés, réponses typées |
| Form Quality | PASS/FAIL/NOT APPLICABLE | Typés, accessibles, validation |
| Error Handling | PASS/FAIL | Tous les cas d'erreur gérés |
| Security Review | PASS/FAIL | Pas de secrets, stockage prudent |
| Performance Review | PASS/FAIL | Lazy loading, pas de recalculs inutiles |
| Accessibility | PASS/FAIL | Labels, navigation clavier, contrastes |
| Internationalization | PASS/FAIL/NOT APPLICABLE | Textes traduisibles |
| Responsive | PASS/FAIL | Mobile, tablette, laptop, grand écran |
| UX/UI Compliance | PASS/FAIL | Design system respecté |
| Tests | PASS/FAIL | Comportements vérifiés |
| Build | PASS/FAIL/NOT EXECUTED | |
| Lint | PASS/FAIL/NOT EXECUTED | |
| Visual Inspection | PASS/FAIL/NOT EXECUTED | |
| Reviewer Verdict | CONFORME/CONFORME AVEC RÉSERVES/NON CONFORME | |

Une tâche frontend ne peut pas passer à `DONE` lorsqu'un contrôle critique est en échec.
