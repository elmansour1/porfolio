import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProjectApiService } from '../../../admin/projects/api/project-api.service';
import { PublicProject } from '../../../admin/projects/models/dto/project.dto';
import { projectPeriodLabel, projectRealStatusLabel, projectTypeLabel } from '../project-labels';

interface ContentSection {
  readonly key: keyof PublicProject;
  readonly labelFr: string;
  readonly labelEn: string;
}

const CONTENT_SECTIONS: readonly ContentSection[] = [
  { key: 'context', labelFr: 'Contexte', labelEn: 'Context' },
  { key: 'problem', labelFr: 'Problématique', labelEn: 'Problem' },
  { key: 'objectives', labelFr: 'Objectifs', labelEn: 'Objectives' },
  { key: 'targetUsers', labelFr: 'Utilisateurs cibles', labelEn: 'Target users' },
  { key: 'role', labelFr: 'Rôle', labelEn: 'Role' },
  { key: 'responsibilities', labelFr: 'Responsabilités', labelEn: 'Responsibilities' },
  { key: 'solution', labelFr: 'Solution', labelEn: 'Solution' },
  { key: 'architectureNotes', labelFr: 'Notes d\u2019architecture', labelEn: 'Architecture notes' },
  { key: 'features', labelFr: 'Fonctionnalités', labelEn: 'Features' },
  { key: 'challenges', labelFr: 'Difficultés rencontrées', labelEn: 'Challenges' },
  { key: 'decisions', labelFr: 'Décisions techniques', labelEn: 'Decisions' },
  { key: 'results', labelFr: 'Résultats', labelEn: 'Results' },
];

@Component({
  selector: 'app-public-project-detail-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="public-profile">
      <nav class="public-profile__nav" aria-label="Navigation publique">
        <a class="public-profile__brand" routerLink="/projects">
          <span>P</span>
          {{ selectedLanguage() === 'en' ? 'All projects' : 'Tous les projets' }}
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

      @if (loading()) {
        <section class="public-empty" aria-live="polite">
          {{ selectedLanguage() === 'en' ? 'Loading project...' : 'Chargement du projet...' }}
        </section>
      } @else if (project(); as project) {
        <section class="public-hero public-hero--compact" aria-labelledby="public-project-title">
          <div class="public-hero__content">
            <p class="public-eyebrow">{{ typeLabel(project) }} · {{ statusLabel(project) }}</p>
            <h1 id="public-project-title">{{ project.title }}</h1>
            @if (project.summary) {
              <p class="public-hero__summary">{{ project.summary }}</p>
            }
            <span class="public-project-card__period">{{ periodLabel(project) }}</span>
            <div class="public-hero__actions">
              @if (project.demoUrl) {
                <a class="public-button public-button--primary" [href]="project.demoUrl" target="_blank" rel="noreferrer">
                  {{ selectedLanguage() === 'en' ? 'Live demo' : 'Démo en ligne' }}
                </a>
              }
              @if (project.githubUrl) {
                <a class="public-button" [href]="project.githubUrl" target="_blank" rel="noreferrer">
                  {{ selectedLanguage() === 'en' ? 'Source code' : 'Code source' }}
                </a>
              }
              @for (link of project.links; track link.url) {
                <a class="public-button" [href]="link.url" target="_blank" rel="noreferrer">{{ link.label }}</a>
              }
            </div>
          </div>
          <div class="public-hero__media">
            @if (project.coverUrl) {
              <img [src]="project.coverUrl" [alt]="project.title" />
            } @else {
              <span>{{ project.title.charAt(0).toUpperCase() }}</span>
            }
          </div>
        </section>

        @if (project.skills.length) {
          <section class="public-about" aria-label="Technologies utilisées">
            <p class="public-eyebrow">{{ selectedLanguage() === 'en' ? 'Technologies' : 'Technologies' }}</p>
            <div class="public-featured-skills">
              @for (skill of project.skills; track skill.id) {
                <span>{{ skill.name }}</span>
              }
            </div>
          </section>
        }

        @if (project.description) {
          <section class="public-about" aria-label="Description">
            <p>{{ project.description }}</p>
          </section>
        }

        @if (visibleSections(project).length) {
          <section class="public-project-detail" aria-label="Détails du projet">
            @for (section of visibleSections(project); track section.key) {
              <article class="public-career__compact">
                <strong>{{ selectedLanguage() === 'en' ? section.labelEn : section.labelFr }}</strong>
                <p>{{ project[section.key] }}</p>
              </article>
            }
          </section>
        }

        @if (project.gallery.length) {
          <section class="public-project-gallery" aria-label="Galerie du projet">
            @for (media of project.gallery; track media.id) {
              <figure>
                <img [src]="media.url" [alt]="media.altText || project.title" />
                @if (media.caption) {
                  <figcaption>{{ media.caption }}</figcaption>
                }
              </figure>
            }
          </section>
        }

        @if (project.similarProjects.length) {
          <section class="public-projects-grid" aria-label="Projets similaires">
            @for (similar of project.similarProjects; track similar.slug) {
              <article class="public-project-card">
                <a class="public-project-card__media" [routerLink]="['/projects', similar.slug]">
                  @if (similar.coverUrl) {
                    <img [src]="similar.coverUrl" [alt]="similar.title" />
                  } @else {
                    <span>{{ similar.title.charAt(0).toUpperCase() }}</span>
                  }
                </a>
                <div class="public-project-card__body">
                  <h2><a [routerLink]="['/projects', similar.slug]">{{ similar.title }}</a></h2>
                  @if (similar.summary) {
                    <p>{{ similar.summary }}</p>
                  }
                </div>
              </article>
            }
          </section>
        }
      } @else {
        <section class="public-empty" aria-labelledby="public-project-missing-title">
          <p class="public-eyebrow">{{ selectedLanguage() === 'en' ? 'Projects' : 'Projets' }}</p>
          <h1 id="public-project-missing-title">
            {{ selectedLanguage() === 'en' ? 'Project not found' : 'Projet introuvable' }}
          </h1>
          <a routerLink="/projects">{{ selectedLanguage() === 'en' ? 'Back to projects' : 'Retour aux projets' }}</a>
        </section>
      }
    </main>
  `,
})
export class PublicProjectDetailPage {
  private readonly projectApi = inject(ProjectApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  readonly selectedLanguage = signal<'fr' | 'en'>('fr');
  readonly loading = signal(true);
  readonly project = signal<PublicProject | null>(null);
  private slug = '';

  constructor() {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
    if (isPlatformBrowser(this.platformId) && this.slug) {
      this.load();
    } else {
      this.loading.set(false);
    }
  }

  changeLanguage(language: string): void {
    this.selectedLanguage.set(language as 'fr' | 'en');
    this.load();
  }

  typeLabel(project: PublicProject): string {
    return projectTypeLabel(project.projectType, this.selectedLanguage());
  }

  statusLabel(project: PublicProject): string {
    return projectRealStatusLabel(project.realStatus, this.selectedLanguage());
  }

  periodLabel(project: PublicProject): string {
    return projectPeriodLabel(
      project.startDate,
      project.endDate,
      project.ongoing,
      this.selectedLanguage(),
    );
  }

  visibleSections(project: PublicProject): ContentSection[] {
    return CONTENT_SECTIONS.filter((section) => {
      const value = project[section.key];
      return typeof value === 'string' && value.trim().length > 0;
    });
  }

  private load(): void {
    this.loading.set(true);
    this.projectApi.publicDetail(this.slug, this.selectedLanguage()).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loading.set(false);
        this.applySeo(project);
      },
      error: () => {
        this.project.set(null);
        this.loading.set(false);
      },
    });
  }

  private applySeo(project: PublicProject): void {
    const title = project.seoTitle || project.title;
    const description = project.seoDescription || project.summary || '';
    this.titleService.setTitle(title);
    if (description) {
      this.metaService.updateTag({ name: 'description', content: description });
    }
  }
}
