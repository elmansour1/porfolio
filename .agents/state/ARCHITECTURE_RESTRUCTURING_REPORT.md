# RAPPORT DE RESTRUCTURATION ARCHITECTURALE

## 1. État initial

Le projet disposait déjà des sous-phases 5.1 à 5.4 implémentées. Les fonctionnalités existantes étaient opérationnelles, mais l'organisation restait insuffisamment explicite pour une évolution senior : DTO backend trop plats, services placés directement dans `application`, mappers dispersés dans des services, contrats frontend et modèles de formulaires parfois proches des composants, composants UI admin partagés encore dans le dossier dashboard.

## 2. Problèmes détectés

- Backend : DTO REST regroupés dans `api.dto` sans distinction request/response.
- Backend : services applicatifs placés directement dans `application`, ce qui mélangeait services, DTO et futurs cas d'utilisation.
- Backend : mappings profil et compétences réalisés dans des services volumineux.
- Backend : stockage média profil placé dans `application` alors qu'il s'agit d'un détail technique.
- Backend : injection constructeur manuelle dans plusieurs services et contrôleurs.
- Frontend : DTO auth, profile et skills non uniformément regroupés en sous-dossiers `models/dto`.
- Frontend : types de formulaires encore proches des pages.
- Frontend : modèle `SelectOption` défini dans une feature alors qu'il est générique.
- Frontend : composants UI admin réutilisables placés dans `admin/dashboard/components`.
- Frontend : mappers de payload/form encore dans les pages.

## 3. Architecture cible retenue

Backend par domaine/fonctionnalité :

- `api` : contrôleurs REST.
- `api/dto/request` : contrats d'entrée REST.
- `api/dto/response` : contrats de sortie REST.
- `application/dto` : résultats internes de cas d'utilisation.
- `application/service` : orchestration applicative et transactions.
- `application/mapper` : conversions DTO/domain/entity.
- `domain/model` : entités, enums et value objects métier.
- `infrastructure/persistence` : repositories Spring Data.
- `infrastructure/storage` : stockage fichier.

Frontend par fonctionnalité :

- `api` : services HTTP typés.
- `models/dto` : contrats API.
- `models/forms` : modèles de formulaires.
- `mappers` : conversions formulaire/API/vue.
- `pages` : orchestration d'écran.
- `admin/shared/ui` : composants UI admin réutilisables.
- `shared/models` : modèles réellement génériques.

## 4. Décisions d'architecture

- ADR-0012 accepté : restructuration progressive par domaines sans hexagonal complet ni CQRS complet.
- Les DTO REST sont séparés par usage request/response.
- Les entités JPA restent des modèles de persistance/domain simples dans `domain.model`; aucun DTO JPA artificiel n'est créé.
- Les mappers sont centralisés lorsque la conversion n'est pas triviale.
- Lombok est utilisé pour réduire le bruit, sans `@Data` sur les entités JPA.
- Les sélections Angular utilisent PrimeNG ; les options sont typées.

## 5. Domaines restructurés

- `audit`
- `auth`
- `profile`
- `skills`
- `shared`
- `admin/auth`
- `admin/profile`
- `admin/skills`
- `admin/shared/ui`

## 6. Fichiers déplacés

- Services backend vers `application/service`.
- DTO REST backend vers `api/dto/request` et `api/dto/response`.
- DTO applicatifs backend vers `application/dto`.
- Modèles backend vers `domain/model`.
- Repositories Spring Data backend vers `infrastructure/persistence`.
- Stockage média profil vers `profile/infrastructure/storage`.
- DTO frontend vers `models/dto`.
- Modèles de formulaire frontend vers `models/forms`.
- Composants UI admin réutilisables vers `admin/shared/ui`.

## 7. Fichiers créés

- `backend/src/main/java/com/faouzi/portfolio/profile/application/mapper/PortfolioProfileMapper.java`
- `backend/src/main/java/com/faouzi/portfolio/skills/application/mapper/SkillCatalogMapper.java`
- `frontend/src/app/shared/models/select-option.model.ts`
- `frontend/src/app/admin/profile/models/forms/profile-form.model.ts`
- `frontend/src/app/admin/profile/models/forms/settings-form.model.ts`
- `frontend/src/app/admin/profile/mappers/profile-form.mapper.ts`
- `frontend/src/app/admin/profile/mappers/settings-form.mapper.ts`
- `frontend/src/app/admin/skills/models/forms/skills-form.model.ts`
- `frontend/src/app/admin/skills/mappers/skills-form.mapper.ts`
- `docs/adr/ADR-0012-restructuration-architecture-senior.md`

## 8. Fichiers supprimés

Aucun fichier source fonctionnel supprimé sans remplacement. Les anciens emplacements ont été nettoyés après déplacement et correction des imports.

## 9. DTO créés ou séparés

- Auth : `LoginRequest`, `ForgotPasswordRequest`, `ResetPasswordRequest`, `AuthSessionResponse`, `CsrfTokenResponse`, `ForgotPasswordResponse`.
- Profile : DTO admin/public, médias, traductions, liens, statistiques, sections, paramètres.
- Skills : DTO catégorie, compétence, traductions, métadonnées, réponses publiques.
- Shared : `ApiStatusResponse`, `ApiErrorResponse`.
- Frontend : `auth.dto.ts`, `profile.dto.ts`, `skills.dto.ts`.

## 10. Modèles métier créés ou corrigés

Les modèles backend existants ont été regroupés dans `domain/model` par domaine. Aucun nouveau comportement métier n'a été ajouté.

## 11. Entités JPA corrigées

Les entités JPA restent non exposées par l'API. Elles utilisent Lombok avec prudence et n'utilisent pas `@Data`.

## 12. Utilisation de Lombok

- `@RequiredArgsConstructor` pour l'injection constructeur Spring.
- `@Getter` et constructeurs JPA protégés sur les entités.
- Aucun `@Data` détecté dans le backend.

## 13. Mappers créés ou corrigés

- `PortfolioProfileMapper` centralise les conversions profil/settings/public/admin.
- `SkillCatalogMapper` centralise les conversions compétences/catégories.
- `profile-form.mapper.ts`, `settings-form.mapper.ts` et `skills-form.mapper.ts` centralisent les conversions frontend.

## 14. Interfaces TypeScript créées ou corrigées

- DTO API dans `models/dto`.
- Modèles de formulaires dans `models/forms`.
- `SelectOption<TValue>` partagé dans `shared/models`.

## 15. Services frontend restructurés

Les services API restent dédiés par feature et ne déclarent plus leurs DTO inline lorsque le sous-dossier `models/dto` existe.

## 16. Composants frontend restructurés

Les pages conservent l'orchestration d'écran. Les composants UI admin génériques sont dans `admin/shared/ui` et ne dépendent pas de domaines métier spécifiques.

## 17. Composants PrimeNG corrigés

Les champs de sélection du périmètre applicatif utilisent PrimeNG (`p-select`, `p-toggleswitch`, `p-checkbox`) avec options typées.

## 18. Selects natifs supprimés

Scan `frontend/src/app` : aucun `<select>`, `<option>` ou `HTMLSelectElement` détecté.

## 19. Tests exécutés

- Backend `mvn test` : PASS, 22 tests.
- Frontend `npm run test:ci` avec Node 20 temporaire : PASS, 24 tests.
- Frontend `npm run lint` avec Node 20 temporaire : PASS.

## 20. Builds exécutés

- Backend `mvn package` : PASS, 22 tests, jar généré.
- Frontend `npm run build` avec Node 20 temporaire : PASS avec warning budget initial +2,93 kB.

## 21. Vérifications non exécutées

- Inspection visuelle runtime non exécutée pendant cette intervention architecture-only : aucun changement UX fonctionnel n'a été introduit et le runtime complet Docker/PostgreSQL n'était pas requis pour valider les déplacements de code.
- E2E navigateur, axe et Lighthouse non exécutés : outillage non installé.

## 22. Régressions détectées et corrigées

- Frontend lint : import/type résiduel `CategoryForm` corrigé vers `SkillCategoryForm`.
- Frontend tests : type résiduel `TranslationForm` corrigé vers `ProfileTranslationForm`.
- Imports backend et frontend corrigés après déplacements.

## 23. Risques résiduels

- Warning de budget Angular initial +2,93 kB à traiter lors d'une passe performance dédiée si la taille continue d'augmenter.
- Les audits E2E/visuels devront être relancés lors de la prochaine sous-phase UI fonctionnelle autorisée.

## 24. Dette technique restante

- Vulnérabilités modérées `npm audit` déjà tracées, non corrigées par `npm audit fix --force` car cela force Angular CLI 21.
- Node local 18.19.1 reste incompatible Angular 20 ; les vérifications frontend ont été exécutées avec Node 20 temporaire.

## 25. Verdict backend

```text
Package by Feature              : PASS
Domain Separation               : PASS
API/Application Separation      : PASS
Persistence Separation          : PASS
DTO Separation                  : PASS
No JPA Entity Exposed           : PASS
Thin Controllers                : PASS
Repository Boundaries           : PASS
Mapping Strategy                : PASS
Lombok Usage                    : PASS
No @Data on JPA Entities        : PASS
Transaction Boundaries          : PASS
Error Handling                  : PASS
Tests                           : PASS
Build                           : PASS
Reviewer Verdict                : CONFORME
```

## 26. Verdict frontend

```text
Feature-Based Structure         : PASS
Core/Shared Boundaries          : PASS
Typed API DTOs                  : PASS
Typed Domain Models             : PASS
Typed Form Models               : PASS
Typed Select Options            : PASS
No Unjustified Any              : PASS
API Calls Outside Components    : PASS
State Separation                : PASS
Mapper Strategy                 : PASS
PrimeNG Component Usage         : PASS
No Native Select in Scope       : PASS
Tailwind/PrimeNG/SCSS Roles     : PASS
Import Boundaries               : PASS
No Circular Dependencies        : PASS
Tests                           : PASS
Build                           : PASS
Lint                            : PASS
Reviewer Verdict                : CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES
```

## 27. Verdict final

```text
RESTRUCTURATION CLÔTURÉE

Verdict final :
CONFORME AVEC RÉSERVES ACCEPTÉES ET TRACÉES

État :
RESTRUCTURATION_CLÔTURÉE_EN_ATTENTE_DU_GO_HUMAIN

Prochaine phase prévue :
Sous-phase 5.5 à définir ou confirmer par GO humain explicite.

Aucune action sur la phase suivante n'a été exécutée.
```
