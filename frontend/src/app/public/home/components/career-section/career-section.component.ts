import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  PublicCareer,
  PublicCareerCertification,
  PublicCareerEducation,
  PublicCareerExperience,
} from '../../../../admin/career/models/dto/career.dto';
import { HomeCopy } from '../../models/home-page.model';

@Component({
  selector: 'app-career-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (career(); as career) {
      @if (hasVisibleContent(career)) {
        <section class="home-section" id="career" aria-labelledby="home-career-title">
          <div class="home-section__intro">
            <p class="home-eyebrow">{{ copy().careerEyebrow }}</p>
            <h2 id="home-career-title">{{ copy().careerTitle }}</h2>
          </div>

          @if (showExperiences() && career.experiences.length) {
            <div class="home-timeline">
              @for (experience of career.experiences; track experience.roleTitle + experience.startDate) {
                <article class="home-timeline__item">
                  <p>{{ experiencePeriod(experience) }}</p>
                  <h3>{{ experience.roleTitle }}</h3>
                  @if (experience.organization) {
                    <strong>{{ experience.organization }}</strong>
                  }
                  @if (experience.summary) {
                    <span>{{ experience.summary }}</span>
                  }
                  @if (experience.skills.length) {
                    <div class="home-chip-list">
                      @for (skill of experience.skills.slice(0, 5); track skill.id) {
                        <span class="home-chip">{{ skill.name }}</span>
                      }
                    </div>
                  }
                </article>
              }
            </div>
          }

          @if (showEducation() && (career.education.length || career.certifications.length)) {
            <div class="home-career-grid">
              @if (career.education.length) {
                <section aria-labelledby="home-education-title">
                  <h3 id="home-education-title">{{ copy().educationTitle }}</h3>
                  @for (education of career.education; track education.institution + education.startDate) {
                    <article class="home-card home-compact-card">
                      <strong>{{ education.title || education.institution }}</strong>
                      <span>{{ educationPeriod(education) }}</span>
                      @if (education.field) {
                        <p>{{ education.field }}</p>
                      }
                    </article>
                  }
                </section>
              }

              @if (career.certifications.length) {
                <section aria-labelledby="home-certifications-title">
                  <h3 id="home-certifications-title">{{ copy().certificationsTitle }}</h3>
                  @for (certification of career.certifications; track certification.issuer + certification.issueDate) {
                    <article class="home-card home-compact-card">
                      <strong>{{ certification.name || certification.issuer }}</strong>
                      <span>{{ certificationPeriod(certification) }}</span>
                      @if (certification.verificationUrl) {
                        <a [href]="certification.verificationUrl" target="_blank" rel="noopener noreferrer">
                          {{ copy().verify }}
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
  `,
})
export class CareerSectionComponent {
  readonly career = input<PublicCareer | null>(null);
  readonly copy = input.required<HomeCopy>();
  readonly showExperiences = input(true);
  readonly showEducation = input(true);

  hasVisibleContent(career: PublicCareer): boolean {
    return (
      (this.showExperiences() && career.experiences.length > 0) ||
      (this.showEducation() && (career.education.length > 0 || career.certifications.length > 0))
    );
  }

  experiencePeriod(experience: PublicCareerExperience): string {
    return this.period(experience.startDate, experience.endDate, experience.currentPosition);
  }

  educationPeriod(education: PublicCareerEducation): string {
    return this.period(education.startDate, education.endDate, education.currentEducation);
  }

  certificationPeriod(certification: PublicCareerCertification): string {
    if (certification.noExpiry) {
      return this.copy().noExpiry;
    }
    return this.period(certification.issueDate, certification.expiryDate, false);
  }

  private period(startDate: string | null, endDate: string | null, current: boolean): string {
    const start = startDate || this.copy().notSpecified;
    const end = current ? this.copy().present : (endDate || this.copy().notSpecified);
    return `${start} - ${end}`;
  }
}
