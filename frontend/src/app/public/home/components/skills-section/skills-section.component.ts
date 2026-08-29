import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicSkills, SkillLevel } from '../../../../admin/skills/models/dto/skills.dto';
import {
  HomeCopy,
  PublicLanguage,
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_PROGRESS,
} from '../../models/home-page.model';

@Component({
  selector: 'app-skills-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (skills(); as catalog) {
      @if (catalog.categories.length || catalog.featuredSkills.length) {
        <section class="home-section home-section--skills" id="skills" aria-labelledby="home-skills-title">
          <div class="home-section__intro home-section__intro--wide">
            <p class="home-eyebrow">{{ copy().skillsEyebrow }}</p>
            <h2 id="home-skills-title">{{ copy().skillsTitle }}</h2>
            <p class="home-section__lede">{{ copy().skillsSubtitle }}</p>
          </div>

          @if (catalog.featuredSkills.length) {
            <div class="home-core-stack" [attr.aria-label]="copy().coreStackLabel">
              <p class="home-core-stack__label">{{ copy().coreStackLabel }}</p>
              <ul class="home-core-stack__list">
                @for (skill of catalog.featuredSkills; track skill.name) {
                  <li>
                    <span class="home-core-stack__name">{{ skill.name }}</span>
                    @if (skill.level) {
                      <span class="home-core-stack__level">{{ levelLabel(skill.level) }}</span>
                    }
                  </li>
                }
              </ul>
            </div>
          }

          @if (catalog.categories.length) {
            <div class="home-skills-bento">
              @for (category of catalog.categories; track category.name) {
                <article class="home-card home-skill-card">
                  <div class="home-skill-card__heading">
                    @if (category.icon) {
                      <i [class]="category.icon" aria-hidden="true"></i>
                    }
                    <div>
                      <h3>{{ category.name }}</h3>
                      @if (category.description) {
                        <p class="home-skill-card__category-desc">{{ category.description }}</p>
                      }
                    </div>
                  </div>
                  @if (category.skills.length) {
                    <ul class="home-skill-list">
                      @for (skill of category.skills; track skill.name) {
                        <li class="home-skill-list__item">
                          <div class="home-skill-list__meta">
                            <span class="home-skill-list__name">{{ skill.name }}</span>
                            @if (skill.level) {
                              <span class="home-skill-list__level">{{ levelLabel(skill.level) }}</span>
                            }
                          </div>
                          @if (skill.usageSummary) {
                            <p class="home-skill-list__usage">{{ skill.usageSummary }}</p>
                          }
                          @if (skill.level) {
                            <div
                              class="home-skill-level"
                              role="presentation"
                              [style.--skill-progress.%]="levelProgress(skill.level)"
                            >
                              <span></span>
                            </div>
                          }
                        </li>
                      }
                    </ul>
                  }
                </article>
              }
            </div>
          }
        </section>
      }
    }
  `,
})
export class SkillsSectionComponent {
  readonly skills = input<PublicSkills | null>(null);
  readonly copy = input.required<HomeCopy>();
  readonly language = input.required<PublicLanguage>();

  levelLabel(level: SkillLevel): string {
    return SKILL_LEVEL_LABELS[level]?.[this.language()] ?? level;
  }

  levelProgress(level: SkillLevel): number {
    return SKILL_LEVEL_PROGRESS[level] ?? 50;
  }
}
