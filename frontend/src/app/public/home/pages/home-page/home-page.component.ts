import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { finalize } from 'rxjs';

import { AboutSectionComponent } from '../../components/about-section/about-section.component';
import { CareerSectionComponent } from '../../components/career-section/career-section.component';
import { CollaborationCtaComponent } from '../../components/collaboration-cta/collaboration-cta.component';
import { FeaturedProjectsSectionComponent } from '../../components/featured-projects-section/featured-projects-section.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { PublicFooterComponent } from '../../components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../../components/public-header/public-header.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { SkillsSectionComponent } from '../../components/skills-section/skills-section.component';
import { WorkProcessSectionComponent } from '../../components/work-process-section/work-process-section.component';
import { HomePageDataService } from '../../data-access/home-page-data.service';
import {
  HOME_COPY,
  HomeNavigationItem,
  HomePageData,
  HomeSectionError,
  HomeSectionKey,
  PublicLanguage,
} from '../../models/home-page.model';

@Component({
  selector: 'app-home-page',
  imports: [
    PublicHeaderComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    SkillsSectionComponent,
    FeaturedProjectsSectionComponent,
    CareerSectionComponent,
    ServicesSectionComponent,
    WorkProcessSectionComponent,
    CollaborationCtaComponent,
    PublicFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home-page">
      <app-public-header
        [settings]="settings()"
        [copy]="copy()"
        [languageValue]="selectedLanguage()"
        [navigation]="navigation()"
        [contactHref]="contactHref()"
        (languageChange)="changeLanguage($event)"
      />

      <main id="main-content" class="home-main" tabindex="-1">
        @if (loading()) {
          <section class="home-loading" aria-live="polite">
            <span aria-hidden="true"></span>
            <p>{{ copy().loading }}</p>
          </section>
        } @else {
          @if (data(); as current) {
            @if (hasError(current, 'portfolio')) {
              <section class="home-section home-error" role="alert">
                <h1>{{ copy().unavailableTitle }}</h1>
                <p>{{ copy().unavailableMessage }}</p>
              </section>
            } @else {
              @if (sectionVisible('HERO')) {
                <app-hero-section
                  [profile]="profile()"
                  [copy]="copy()"
                  [contactHref]="contactHref()"
                  [servicesHref]="servicesHref()"
                />
              }

              @if (statistics().length && sectionVisible('HERO')) {
                <section class="home-stats" [attr.aria-label]="copy().professionalIndicators">
                  @for (statistic of statistics(); track statistic.label) {
                    <article>
                      <strong>{{ statistic.value }}</strong>
                      <span>{{ statistic.label }}</span>
                    </article>
                  }
                </section>
              }

              @if (partialErrors().length) {
                <p class="home-partial-error" role="status">{{ copy().partialError }}</p>
              }

              @if (sectionVisible('ABOUT')) {
                <app-about-section [profile]="profile()" [copy]="copy()" />
              }

              @if (sectionVisible('SKILLS')) {
                <app-skills-section [skills]="current.skills" [copy]="copy()" [language]="selectedLanguage()" />
              }

              @if (sectionVisible('PROJECTS')) {
                <app-featured-projects-section
                  [projects]="current.featuredProjects"
                  [copy]="copy()"
                  [language]="selectedLanguage()"
                />
              }

              @if (sectionVisible('EXPERIENCES') || sectionVisible('EDUCATION')) {
                <app-career-section
                  [career]="current.career"
                  [copy]="copy()"
                  [showExperiences]="sectionVisible('EXPERIENCES')"
                  [showEducation]="sectionVisible('EDUCATION')"
                />
              }

              @if (sectionVisible('SERVICES')) {
                <app-services-section
                  [services]="current.services"
                  [copy]="copy()"
                  [contactHref]="contactHref()"
                />
              }

              @if (sectionVisible('METHOD')) {
                <app-work-process-section [steps]="current.workProcessSteps" [copy]="copy()" />
              }

              @if (sectionVisible('CONTACT')) {
                <app-collaboration-cta [profile]="profile()" [copy]="copy()" />
              }
            }
          }
        }
      </main>

      <app-public-footer
        [settings]="settings()"
        [profile]="profile()"
        [copy]="copy()"
        [contactHref]="contactHref()"
      />
    </div>
  `,
})
export class HomePageComponent {
  private readonly dataService = inject(HomePageDataService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly destroyRef = inject(DestroyRef);

  readonly selectedLanguage = signal<PublicLanguage>('fr');
  readonly loading = signal(true);
  readonly data = signal<HomePageData | null>(null);
  readonly copy = computed(() => HOME_COPY[this.selectedLanguage()]);
  readonly settings = computed(() => this.data()?.portfolio?.settings ?? null);
  readonly profile = computed(() => {
    const portfolio = this.data()?.portfolio;
    return portfolio?.profilePublished ? portfolio.profile : null;
  });
  readonly statistics = computed(() => this.profile()?.statistics ?? []);
  readonly contactHref = computed(() => (this.sectionVisible('CONTACT') ? '#contact' : null));
  readonly servicesHref = computed(() =>
    this.sectionVisible('SERVICES') && (this.data()?.services.length ?? 0) > 0 ? '#services' : null,
  );
  readonly partialErrors = computed(() =>
    (this.data()?.errors ?? []).filter((error) => error !== 'portfolio'),
  );
  readonly navigation = computed<readonly HomeNavigationItem[]>(() => {
    const copy = this.copy();
    const data = this.data();
    const profile = this.profile();
    const items: HomeNavigationItem[] = [];

    if (profile && this.sectionVisible('ABOUT')) {
      items.push({ fragment: 'about', label: copy.aboutEyebrow });
    }
    if (this.sectionVisible('SKILLS') && (data?.skills?.categories.length || data?.skills?.featuredSkills.length)) {
      items.push({ fragment: 'skills', label: copy.skillsEyebrow });
    }
    if (this.sectionVisible('SERVICES') && data?.services.length) {
      items.push({ fragment: 'services', label: copy.servicesEyebrow });
    }
    if (this.sectionVisible('METHOD') && data?.workProcessSteps.length) {
      items.push({ fragment: 'method', label: copy.methodEyebrow });
    }
    return items;
  });

  constructor() {
    this.load(this.selectedLanguage());
  }

  changeLanguage(language: PublicLanguage): void {
    this.selectedLanguage.set(language);
    this.load(language);
  }

  sectionVisible(key: HomeSectionKey): boolean {
    return this.dataService.sectionVisible(this.data()?.portfolio ?? null, key);
  }

  hasError(data: HomePageData, error: HomeSectionError): boolean {
    return data.errors.includes(error);
  }

  private load(language: PublicLanguage): void {
    this.loading.set(true);
    this.dataService
      .load(language)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.data.set(data);
        this.updateSeo(data);
      });
  }

  private updateSeo(data: HomePageData): void {
    const portfolio = data.portfolio;
    const profile = portfolio?.profilePublished ? portfolio.profile : null;
    const siteName = portfolio?.settings.publicSiteName || this.copy().defaultSiteName;
    const title = profile?.displayName
      ? `${profile.displayName} | ${profile.professionalTitle || siteName}`
      : siteName;
    const description =
      profile?.shortSummary ||
      profile?.tagline ||
      (data.language === 'en'
        ? 'Professional portfolio presenting projects, skills, services and working method.'
        : 'Portfolio professionnel présentant projets, compétences, services et méthode de travail.');

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
  }
}
