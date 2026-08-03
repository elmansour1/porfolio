import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicSkills, SkillLevel } from '../../../../admin/skills/models/dto/skills.dto';
import { HomeCopy, PublicLanguage, SKILL_LEVEL_LABELS } from '../../models/home-page.model';

@Component({
  selector: 'app-skills-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (skills(); as catalog) {
      @if (catalog.categories.length || catalog.featuredSkills.length) {
        <section class="home-section" id="skills" aria-labelledby="home-skills-title">
          <div class="home-section__intro">
            <p class="home-eyebrow">{{ copy().skillsEyebrow }}</p>
            <h2 id="home-skills-title">{{ copy().skillsTitle }}</h2>
          </div>

          @if (catalog.featuredSkills.length) {
            <div class="home-chip-list" [attr.aria-label]="copy().featuredSkills">
              @for (skill of catalog.featuredSkills; track skill.name) {
                <span class="home-chip">{{ skill.name }}</span>
              }
            </div>
          }

          @if (catalog.categories.length) {
            <div class="home-skills-grid">
              @for (category of catalog.categories; track category.name) {
                <article class="home-card home-skill-card">
                  <div class="home-skill-card__heading">
                    @if (category.icon) {
                      <i [class]="category.icon" aria-hidden="true"></i>
                    }
                    <h3>{{ category.name }}</h3>
                  </div>
                  @if (category.description) {
                    <p>{{ category.description }}</p>
                  }
                  @if (category.skills.length) {
                    <ul>
                      @for (skill of category.skills; track skill.name) {
                        <li>
                          <span>{{ skill.name }}</span>
                          @if (skill.level) {
                            <small>{{ levelLabel(skill.level) }}</small>
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
}
