export interface AdminNavigationItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
  readonly status: 'available' | 'disabled';
  readonly hint?: string;
}

export const adminNavigationItems: readonly AdminNavigationItem[] = [
  {
    label: 'Tableau de bord',
    route: '/admin/dashboard',
    icon: 'pi pi-chart-line',
    status: 'available',
  },
  {
    label: 'Profil',
    route: '/admin/profile',
    icon: 'pi pi-user',
    status: 'available',
  },
  {
    label: 'Compétences',
    route: '/admin/skills',
    icon: 'pi pi-bolt',
    status: 'available',
  },
  {
    label: 'Expériences',
    route: '/admin/experiences',
    icon: 'pi pi-briefcase',
    status: 'available',
  },
  {
    label: 'Formations',
    route: '/admin/education',
    icon: 'pi pi-graduation-cap',
    status: 'available',
  },
  {
    label: 'Certifications',
    route: '/admin/certifications',
    icon: 'pi pi-verified',
    status: 'available',
  },
  {
    label: 'Projets',
    route: '/admin/projects',
    icon: 'pi pi-folder-open',
    status: 'available',
  },
  {
    label: 'Services',
    route: '/admin/services',
    icon: 'pi pi-sitemap',
    status: 'disabled',
    hint: 'Gestion non implémentée en 5.2',
  },
  {
    label: 'Messages',
    route: '/admin/messages',
    icon: 'pi pi-inbox',
    status: 'disabled',
    hint: 'Gestion non implémentée en 5.2',
  },
  {
    label: 'Médias',
    route: '/admin/media',
    icon: 'pi pi-images',
    status: 'disabled',
    hint: 'Gestion non implémentée en 5.2',
  },
  {
    label: 'SEO',
    route: '/admin/seo',
    icon: 'pi pi-search',
    status: 'disabled',
    hint: 'Gestion non implémentée en 5.2',
  },
  {
    label: 'Paramètres',
    route: '/admin/settings',
    icon: 'pi pi-cog',
    status: 'available',
  },
];

export function adminPageTitle(url: string): string {
  const cleanUrl = url.split('?')[0];
  if (cleanUrl === '/admin' || cleanUrl === '/admin/dashboard') {
    return 'Tableau de bord';
  }

  const item = adminNavigationItems.find((navigationItem) => navigationItem.route === cleanUrl);
  return item?.label ?? 'Page introuvable';
}
