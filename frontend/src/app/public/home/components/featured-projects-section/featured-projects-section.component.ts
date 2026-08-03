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
      <section class="home-section home-section--muted" id="projects" aria-labelledby="home-projects-title">
        <div class="home-section__intro">
          <p class="home-eyebrow">{{ copy().projectsEyebrow }}</p>
          <h2 id="home-projects-title">{{ copy().projectsTitle }}</h2>
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
              </div>
            </article>
          }
        </div>

        <a class="home-button" routerLink="/projects">{{ copy().projectsLink }}</a>
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
