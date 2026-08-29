import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PublicProjectSummary } from '../../../../admin/projects/models/dto/project.dto';
import { projectTypeLabel } from '../../../projects/project-labels';
import { HomeCopy, PublicLanguage } from '../../models/home-page.model';

@Component({
  selector: 'app-featured-projects-section',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (projects().length) {
      <section class="home-section home-section--muted home-section--projects" id="projects" aria-labelledby="home-projects-title">
        <div class="home-section__intro home-section__intro--wide">
          <p class="home-eyebrow">{{ copy().projectsEyebrow }}</p>
          <h2 id="home-projects-title">{{ copy().projectsTitle }}</h2>
          <p class="home-section__lede">{{ copy().projectsSubtitle }}</p>
        </div>

        <div class="home-project-grid">
          @for (project of projects(); track project.slug) {
            <article class="home-card home-project-card">
              <a class="home-project-card__media" [routerLink]="['/projects', project.slug]">
                @if (project.coverUrl) {
                  <img [src]="project.coverUrl" [alt]="project.title" width="520" height="320" loading="lazy" />
                } @else {
                  <span aria-hidden="true">{{ project.title.charAt(0).toUpperCase() }}</span>
                }
              </a>
              <div class="home-project-card__body">
                <p class="home-eyebrow">{{ typeLabel(project) }}</p>
                <h3><a [routerLink]="['/projects', project.slug]">{{ project.title }}</a></h3>
                @if (project.summary) {
                  <p>{{ project.summary }}</p>
                }
                @if (project.skills.length) {
                  <div class="home-chip-list">
                    @for (skill of project.skills.slice(0, 4); track skill.id) {
                      <span class="home-chip">{{ skill.name }}</span>
                    }
                  </div>
                }
                <a class="home-project-card__link" [routerLink]="['/projects', project.slug]">
                  {{ copy().projectCaseStudyLink }}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          }
        </div>

        <div class="home-section__footer">
          <a class="home-button home-button--primary" routerLink="/projects">{{ copy().projectsLink }}</a>
        </div>
      </section>
    }
  `,
})
export class FeaturedProjectsSectionComponent {
  readonly projects = input.required<readonly PublicProjectSummary[]>();
  readonly copy = input.required<HomeCopy>();
  readonly language = input.required<PublicLanguage>();

  typeLabel(project: PublicProjectSummary): string {
    return projectTypeLabel(project.projectType, this.language());
  }
}
