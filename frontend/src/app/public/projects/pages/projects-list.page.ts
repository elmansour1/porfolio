import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectApiService } from '../../../admin/projects/api/project-api.service';
import { PublicProjectSummary } from '../../../admin/projects/models/dto/project.dto';
import { projectPeriodLabel, projectTypeLabel } from '../project-labels';

const PAGE_SIZE = 9;

@Component({
  selector: 'app-public-projects-list-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="public-profile">
      <nav class="public-profile__nav" aria-label="Navigation publique">
        <a class="public-profile__brand" routerLink="/">
          <span>P</span>
          {{ selectedLanguage() === 'en' ? 'Back to portfolio' : 'Retour au portfolio' }}
        </a>
        <div class="public-profile__languages" aria-label="Langue">
          @for (language of ['fr', 'en']; track language) {
            <button
              type="button"
              [class.public-profile__language--active]="language === selectedLanguage()"
              (click)="changeLanguage(language)"
            >
              {{ language.toUpperCase() }}
            </button>
          }
        </div>
      </nav>

      <section class="public-hero public-hero--compact" aria-labelledby="public-projects-title">
        <div class="public-hero__content">
          <p class="public-eyebrow">{{ selectedLanguage() === 'en' ? 'Projects' : 'Projets' }}</p>
          <h1 id="public-projects-title">
            {{ selectedLanguage() === 'en' ? 'Case studies' : 'Études de cas' }}
          </h1>
          <p class="public-hero__summary">
            {{
              selectedLanguage() === 'en'
                ? 'A selection of projects delivered end to end, with context, decisions and results.'
                : "Une sélection de projets réalisés de bout en bout, avec contexte, décisions et résultats."
            }}
          </p>
        </div>
      </section>

      @if (loading()) {
        <section class="public-empty" aria-live="polite">
          {{ selectedLanguage() === 'en' ? 'Loading projects...' : 'Chargement des projets...' }}
        </section>
      } @else if (projects().length) {
        <section class="public-projects-grid" aria-label="Liste des projets">
          @for (project of projects(); track project.slug) {
            <article class="public-project-card">
              <a class="public-project-card__media" [routerLink]="['/projects', project.slug]">
                @if (project.coverUrl) {
                  <img [src]="project.coverUrl" [alt]="project.title" />
                } @else {
                  <span>{{ project.title.charAt(0).toUpperCase() }}</span>
                }
              </a>
              <div class="public-project-card__body">
                <p class="public-eyebrow">{{ typeLabel(project) }}</p>
                <h2><a [routerLink]="['/projects', project.slug]">{{ project.title }}</a></h2>
                @if (project.summary) {
                  <p>{{ project.summary }}</p>
                }
                <span class="public-project-card__period">
                  {{ periodLabel(project) }}
                </span>
                @if (project.skills.length) {
                  <div class="public-featured-skills" aria-label="Technologies">
                    @for (skill of project.skills; track skill.id) {
                      <span>{{ skill.name }}</span>
                    }
                  </div>
                }
              </div>
            </article>
          }
        </section>

        @if (totalPages() > 1) {
          <nav class="public-pagination" aria-label="Pagination des projets">
            <button type="button" [disabled]="page() === 0" (click)="goToPage(page() - 1)">
              {{ selectedLanguage() === 'en' ? 'Previous' : 'Précédent' }}
            </button>
            <span>{{ page() + 1 }} / {{ totalPages() }}</span>
            <button
              type="button"
              [disabled]="page() + 1 >= totalPages()"
              (click)="goToPage(page() + 1)"
            >
              {{ selectedLanguage() === 'en' ? 'Next' : 'Suivant' }}
            </button>
          </nav>
        }
      } @else {
        <section class="public-empty" aria-labelledby="public-projects-empty-title">
          <p class="public-eyebrow">{{ selectedLanguage() === 'en' ? 'Projects' : 'Projets' }}</p>
          <h1 id="public-projects-empty-title">
            {{
              selectedLanguage() === 'en'
                ? 'No published project yet'
                : 'Aucun projet publié pour le moment'
            }}
          </h1>
          <a routerLink="/">{{ selectedLanguage() === 'en' ? 'Back to portfolio' : 'Retour au portfolio' }}</a>
        </section>
      }
    </main>
  `,
})
export class PublicProjectsListPage {
  private readonly projectApi = inject(ProjectApiService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly selectedLanguage = signal<'fr' | 'en'>('fr');
  readonly loading = signal(true);
  readonly projects = signal<readonly PublicProjectSummary[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.load(0);
    } else {
      this.loading.set(false);
    }
  }

  changeLanguage(language: string): void {
    this.selectedLanguage.set(language as 'fr' | 'en');
    this.load(0);
  }

  goToPage(page: number): void {
    this.load(page);
  }

  typeLabel(project: PublicProjectSummary): string {
    return projectTypeLabel(project.projectType, this.selectedLanguage());
  }

  periodLabel(project: PublicProjectSummary): string {
    return projectPeriodLabel(
      project.startDate,
      project.endDate,
      project.ongoing,
      this.selectedLanguage(),
    );
  }

  private load(page: number): void {
    this.loading.set(true);
    this.projectApi.publicList(this.selectedLanguage(), page, PAGE_SIZE).subscribe({
      next: (response) => {
        this.projects.set(response.items);
        this.page.set(response.page);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.projects.set([]);
        this.page.set(0);
        this.totalPages.set(0);
        this.loading.set(false);
      },
    });
  }
}
