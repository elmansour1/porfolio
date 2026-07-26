export interface AuthSession {
  id: string;
  email: string;
  passwordChangeRequired: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
  expiresAt?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface CsrfTokenResponse {
  headerName: string;
  parameterName: string;
  token: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details: string[];
  traceId: string;
  timestamp: string;
}
