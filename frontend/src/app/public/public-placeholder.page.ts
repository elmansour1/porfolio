import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CareerApiService } from '../admin/career/api/career-api.service';
import { PublicCareer } from '../admin/career/models/dto/career.dto';
import { ProfileApiService } from '../admin/profile/api/profile-api.service';
import { PublicPortfolio } from '../admin/profile/models/dto/profile.dto';
import { ProjectApiService } from '../admin/projects/api/project-api.service';
import { PublicProjectSummary } from '../admin/projects/models/dto/project.dto';
import { SkillsApiService } from '../admin/skills/api/skills-api.service';
import { PublicSkills } from '../admin/skills/models/dto/skills.dto';
import { projectTypeLabel } from './projects/project-labels';

@Component({
  selector: 'app-public-placeholder-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="public-profile" [class.public-profile--loading]="loading()">
      @if (portfolio(); as portfolio) {
        <nav class="public-profile__nav" aria-label="Navigation publique">
          <a class="public-profile__brand" href="/">
            @if (portfolio.settings.logoUrl) {
              <img [src]="portfolio.settings.logoUrl" alt="" />
            } @else {
              <span>{{ portfolio.settings.monogram }}</span>
            }
            {{ portfolio.settings.publicSiteName }}
          </a>
          <div class="public-profile__languages" aria-label="Langue">
            @for (language of portfolio.settings.activeLanguages; track language) {
              <button
                type="button"
                [class.public-profile__language--active]="language === selectedLanguage()"
                (click)="changeLanguage(language)"
              >
                {{ language.toUpperCase() }}
              </button>
            }
          </div>
          <a routerLink="/projects">Projets</a>
          <a href="/admin/login">Administration</a>
        </nav>

        @if (portfolio.profilePublished && portfolio.profile; as profile) {
          <section class="public-hero" aria-labelledby="public-title">
            <div class="public-hero__content">
              @if (profile.availabilityLabel) {
                <p class="public-availability">{{ profile.availabilityLabel }}</p>
              }
              <h1 id="public-title">{{ profile.displayName }}</h1>
              <p class="public-hero__title">{{ profile.professionalTitle }}</p>
              @if (profile.shortSummary) {
                <p class="public-hero__summary">{{ profile.shortSummary }}</p>
              }
              <div class="public-hero__actions">
                @if (profile.primaryCtaLabel && profile.primaryCtaUrl) {
                  <a class="public-button public-button--primary" [href]="profile.primaryCtaUrl">
                    {{ profile.primaryCtaLabel }}
                  </a>
                }
                @if (profile.secondaryCtaLabel && profile.secondaryCtaUrl) {
                  <a
                    class="public-button"
                    [href]="profile.secondaryCtaUrl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {{ profile.secondaryCtaLabel }}
                  </a>
                }
                @if (profile.cvUrl) {
                  <a class="public-button" [href]="profile.cvUrl">Télécharger le CV</a>
                }
              </div>
            </div>
            <div class="public-hero__media" aria-label="Photo professionnelle">
              @if (profile.photoUrl) {
                <img [src]="profile.photoUrl" [alt]="profile.photoAltText || profile.displayName" />
              } @else {
                <span>{{ initials(profile.displayName) }}</span>
              }
            </div>
          </section>

          @if (profile.statistics.length) {
            <section class="public-stats" aria-label="Indicateurs professionnels">
              @for (statistic of profile.statistics; track statistic.label) {
                <article>
                  <strong>{{ statistic.value }}</strong>
                  <span>{{ statistic.label }}</span>
                </article>
              }
            </section>
          }

          @if (profile.aboutText || profile.biography) {
            <section class="public-about" aria-labelledby="public-about-title">
              <p class="public-eyebrow">À propos</p>
              <h2 id="public-about-title">{{ profile.tagline || profile.professionalTitle }}</h2>
              <p>{{ profile.aboutText || profile.biography }}</p>
            </section>
          }

          @if (publicSkills(); as skillCatalog) {
            @if (skillCatalog.categories.length) {
              <section class="public-skills" aria-labelledby="public-skills-title">
                <p class="public-eyebrow">Compétences</p>
                <h2 id="public-skills-title">Expertises structurées</h2>
                @if (skillCatalog.featuredSkills.length) {
                  <div class="public-featured-skills" aria-label="Compétences principales">
                    @for (skill of skillCatalog.featuredSkills; track skill.name) {
                      <span>{{ skill.name }}</span>
                    }
                  </div>
                }
                <div class="public-skill-groups">
                  @for (category of skillCatalog.categories; track category.name) {
                    <article class="public-skill-category">
                      <div>
                        @if (category.icon) {
                          <i [class]="category.icon" aria-hidden="true"></i>
                        }
                        <h3>{{ category.name }}</h3>
                      </div>
                      @if (category.description) {
                        <p>{{ category.description }}</p>
                      }
                      <ul>
                        @for (skill of category.skills; track skill.name) {
                          <li>
                            <strong>{{ skill.name }}</strong>
                            @if (skill.level) {
                              <span>{{ skillLevelLabel(skill.level) }}</span>
                            }
                            @if (skill.description) {
                              <p>{{ skill.description }}</p>
                            }
                          </li>
                        }
                      </ul>
                    </article>
                  }
                </div>
              </section>
            }
          }

          @if (featuredProjects().length) {
            <section class="public-skills" aria-labelledby="public-projects-title">
              <p class="public-eyebrow">
                {{ selectedLanguage() === 'en' ? 'Selected work' : 'Projets phares' }}
              </p>
              <h2 id="public-projects-title">
                {{ selectedLanguage() === 'en' ? 'Featured projects' : 'Projets mis en avant' }}
              </h2>
              <div class="public-projects-grid">
                @for (project of featuredProjects(); track project.slug) {
                  <article class="public-project-card">
                    <a class="public-project-card__media" [routerLink]="['/projects', project.slug]">
                      @if (project.coverUrl) {
                        <img [src]="project.coverUrl" [alt]="project.title" />
                      } @else {
                        <span>{{ project.title.charAt(0).toUpperCase() }}</span>
                      }
                    </a>
                    <div class="public-project-card__body">
                      <p class="public-eyebrow">{{ projectType(project) }}</p>
                      <h2><a [routerLink]="['/projects', project.slug]">{{ project.title }}</a></h2>
                      @if (project.summary) {
                        <p>{{ project.summary }}</p>
                      }
                    </div>
                  </article>
                }
              </div>
              <a class="public-button" routerLink="/projects">
                {{ selectedLanguage() === 'en' ? 'View all projects' : 'Voir tous les projets' }}
              </a>
            </section>
          }

          @if (publicCareer(); as career) {
            @if (career.experiences.length || career.education.length || career.certifications.length) {
              <section class="public-career" aria-labelledby="public-career-title">
                <p class="public-eyebrow">
                  {{ selectedLanguage() === 'en' ? 'Career' : 'Parcours' }}
                </p>
                <h2 id="public-career-title">
                  {{
                    selectedLanguage() === 'en'
                      ? 'Experience, education and certifications'
                      : 'Expériences, formations et certifications'
                  }}
                </h2>

                @if (career.experiences.length) {
                  <div class="public-career__timeline" aria-label="Expériences publiées">
                    @for (experience of career.experiences; track experience.roleTitle + experience.startDate) {
                      <article class="public-career__item">
                        <span>{{ period(experience.startDate, experience.endDate, experience.currentPosition) }}</span>
                        <h3>{{ experience.roleTitle }}</h3>
                        @if (experience.organization) {
                          <p>{{ experience.organization }}</p>
                        }
                        @if (experience.summary) {
                          <p>{{ experience.summary }}</p>
                        }
                        @if (experience.skills.length) {
                          <div class="public-featured-skills" aria-label="Technologies liées">
                            @for (skill of experience.skills; track skill.id) {
                              <span>{{ skill.name }}</span>
                            }
                          </div>
                        }
                      </article>
                    }
                  </div>
                }

                @if (career.education.length || career.certifications.length) {
                  <div class="public-career__grid">
                    @if (career.education.length) {
                      <section aria-labelledby="public-education-title">
                        <h3 id="public-education-title">
                          {{ selectedLanguage() === 'en' ? 'Education' : 'Formations' }}
                        </h3>
                        @for (item of career.education; track item.institution + item.startDate) {
                          <article class="public-career__compact">
                            <strong>{{ item.title || item.institution }}</strong>
                            <span>{{ period(item.startDate, item.endDate, item.currentEducation) }}</span>
                            @if (item.field) {
                              <p>{{ item.field }}</p>
                            }
                          </article>
                        }
                      </section>
                    }

                    @if (career.certifications.length) {
                      <section aria-labelledby="public-certifications-title">
                        <h3 id="public-certifications-title">Certifications</h3>
                        @for (certification of career.certifications; track certification.issuer + certification.issueDate) {
                          <article class="public-career__compact">
                            <strong>{{ certification.name || certification.issuer }}</strong>
                            <span>
                              {{
                                certification.noExpiry
                                  ? (selectedLanguage() === 'en' ? 'No expiry' : 'Sans expiration')
                                  : period(certification.issueDate, certification.expiryDate, false)
                              }}
                            </span>
                            @if (certification.verificationUrl) {
                              <a [href]="certification.verificationUrl" target="_blank" rel="noreferrer">
                                {{ selectedLanguage() === 'en' ? 'Verify' : 'Vérifier' }}
                              </a>
                            }
                          </article>
                        }
                      </section>
                    }
                  </div>
                }
              </section>
            }
          }

          <footer class="public-footer">
            <div>
              <strong>{{ profile.displayName }}</strong>
              @if (profile.footerText) {
                <p>{{ profile.footerText }}</p>
              }
              @if (portfolio.settings.footerCopyright) {
                <small>{{ portfolio.settings.footerCopyright }}</small>
              }
            </div>
            @if (profile.links.length) {
              <div class="public-links" aria-label="Liens professionnels">
                @for (link of profile.links; track link.url) {
                  <a
                    [href]="link.url"
                    [target]="link.openInNewTab ? '_blank' : '_self'"
                    rel="noreferrer"
                  >
                    {{ link.label }}
                  </a>
                }
              </div>
            }
          </footer>
        } @else {
          <section class="public-empty" aria-labelledby="public-empty-title">
            <p class="public-eyebrow">Portfolio professionnel</p>
            <h1 id="public-empty-title">Profil non publié</h1>
            <p>
              Les informations publiques seront visibles après publication du profil et d'une
              traduction complète.
            </p>
            <a href="/admin/login">Accéder à l'administration</a>
          </section>
        }
      } @else if (loading()) {
        <section class="public-empty" aria-live="polite">Chargement du portfolio...</section>
      } @else {
        <section class="public-empty public-empty--error">
          Le portfolio public n'est pas disponible pour le moment.
        </section>
      }
    </main>
  `,
})
export class PublicPlaceholderPage {
  private readonly api = inject(ProfileApiService);
  private readonly skillsApi = inject(SkillsApiService);
  private readonly careerApi = inject(CareerApiService);
  private readonly projectApi = inject(ProjectApiService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly selectedLanguage = signal<'fr' | 'en'>('fr');
  readonly loading = signal(true);
  readonly portfolio = signal<PublicPortfolio | null>(null);
  readonly publicSkills = signal<PublicSkills | null>(null);
  readonly publicCareer = signal<PublicCareer | null>(null);
  readonly featuredProjects = signal<readonly PublicProjectSummary[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.load('fr');
    } else {
      this.loading.set(false);
    }
  }

  changeLanguage(language: 'fr' | 'en'): void {
    this.selectedLanguage.set(language);
    this.load(language);
  }

  initials(displayName: string): string {
    return displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  private load(language: 'fr' | 'en'): void {
    this.loading.set(true);
    forkJoin({
      portfolio: this.api.publicPortfolio(language),
      skills: this.skillsApi.publicSkills(language),
      career: this.careerApi.publicCareer(language),
      projects: this.projectApi.publicFeatured(language),
    }).subscribe({
      next: ({ portfolio, skills, career, projects }) => {
        this.portfolio.set(portfolio);
        this.publicSkills.set(skills);
        this.publicCareer.set(career);
        this.featuredProjects.set(projects);
        this.loading.set(false);
      },
      error: () => {
        this.portfolio.set(null);
        this.publicSkills.set(null);
        this.publicCareer.set(null);
        this.featuredProjects.set([]);
        this.loading.set(false);
      },
    });
  }

  projectType(project: PublicProjectSummary): string {
    return projectTypeLabel(project.projectType, this.selectedLanguage());
  }

  period(startDate: string, endDate: string | null, current: boolean): string {
    const currentLabel = this.selectedLanguage() === 'en' ? 'Present' : 'En cours';
    const missingLabel = this.selectedLanguage() === 'en' ? 'Not specified' : 'Non renseigné';
    return `${startDate} - ${current ? currentLabel : endDate ?? missingLabel}`;
  }

  skillLevelLabel(level: string): string {
    const labels: Record<string, string> = {
      NOTIONS: this.selectedLanguage() === 'en' ? 'Awareness' : 'Notions',
      OPERATIONAL: this.selectedLanguage() === 'en' ? 'Operational' : 'Opérationnel',
      ADVANCED: this.selectedLanguage() === 'en' ? 'Advanced' : 'Avancé',
      CORE_EXPERTISE: this.selectedLanguage() === 'en' ? 'Core expertise' : 'Expertise principale',
    };
    return labels[level] ?? level;
  }
}
