import { Routes } from '@angular/router';

import { adminAuthGuard } from './admin/auth/guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/public-placeholder.page').then((module) => module.PublicPlaceholderPage),
    title: 'Portfolio public - fondation',
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/auth/pages/login.page').then((module) => module.LoginPage),
    title: 'Connexion administration',
  },
  {
    path: 'admin/forgot-password',
    loadComponent: () =>
      import('./admin/auth/pages/forgot-password.page').then((module) => module.ForgotPasswordPage),
    title: 'Mot de passe oublié',
  },
  {
    path: 'admin/reset-password',
    loadComponent: () =>
      import('./admin/auth/pages/reset-password.page').then((module) => module.ResetPasswordPage),
    title: 'Réinitialisation mot de passe',
  },
  {
    path: 'admin/session-expired',
    loadComponent: () =>
      import('./admin/auth/pages/session-expired.page').then((module) => module.SessionExpiredPage),
    title: 'Session expirée',
  },
  {
    path: 'admin/forbidden',
    loadComponent: () =>
      import('./admin/auth/pages/forbidden.page').then((module) => module.ForbiddenPage),
    title: 'Accès refusé',
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./admin/shell/admin-shell.page').then((module) => module.AdminShellPage),
    title: 'Administration',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/dashboard/admin-dashboard.page').then(
            (module) => module.AdminDashboardPage,
          ),
        title: 'Tableau de bord administration',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./admin/profile/profile.page').then((module) => module.ProfilePage),
        title: 'Profil professionnel',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./admin/profile/settings.page').then((module) => module.SettingsPage),
        title: 'Paramètres généraux',
      },
      {
        path: '**',
        loadComponent: () =>
          import('./admin/shell/admin-not-found.page').then((module) => module.AdminNotFoundPage),
        title: 'Page admin introuvable',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
