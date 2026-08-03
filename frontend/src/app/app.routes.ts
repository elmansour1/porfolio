import { Routes } from '@angular/router';

import { adminAuthGuard } from './admin/auth/guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/home/pages/home-page/home-page.component').then(
        (module) => module.HomePageComponent,
      ),
    title: 'Portfolio professionnel',
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./public/projects/pages/projects-list.page').then(
        (module) => module.PublicProjectsListPage,
      ),
    title: 'Projets',
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./public/projects/pages/project-detail.page').then(
        (module) => module.PublicProjectDetailPage,
      ),
    title: 'Projet',
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
          import('./admin/profile/pages/profile.page').then((module) => module.ProfilePage),
        title: 'Profil professionnel',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./admin/profile/pages/settings.page').then((module) => module.SettingsPage),
        title: 'Paramètres généraux',
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./admin/skills/pages/skills.page').then((module) => module.SkillsPage),
        title: 'Compétences',
      },
      {
        path: 'experiences',
        loadComponent: () =>
          import('./admin/career/pages/career.page').then((module) => module.CareerPage),
        title: 'Expériences',
      },
      {
        path: 'education',
        loadComponent: () =>
          import('./admin/career/pages/career.page').then((module) => module.CareerPage),
        title: 'Formations',
      },
      {
        path: 'certifications',
        loadComponent: () =>
          import('./admin/career/pages/career.page').then((module) => module.CareerPage),
        title: 'Certifications',
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./admin/projects/pages/projects.page').then((module) => module.ProjectsPage),
        title: 'Projets',
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./admin/services/pages/services.page').then((module) => module.ServicesPage),
        title: 'Services',
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
