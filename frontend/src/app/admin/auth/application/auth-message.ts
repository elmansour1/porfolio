import { HttpErrorResponse } from '@angular/common/http';

import { ApiErrorResponse } from '../models/dto/auth.dto';

export function authErrorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Une erreur inattendue est survenue.';
  }

  const body = error.error as Partial<ApiErrorResponse> | undefined;
  if (error.status === 401) {
    return 'Identifiants invalides ou session expirée.';
  }
  if (error.status === 403) {
    return 'Action refusée. Vérifiez votre session et réessayez.';
  }
  if (error.status === 429) {
    return 'Trop de tentatives. Réessayez plus tard.';
  }
  if (body?.code === 'WEAK_PASSWORD') {
    return 'Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un symbole.';
  }
  if (body?.message) {
    return body.message;
  }
  return 'Le service est indisponible. Réessayez plus tard.';
}
