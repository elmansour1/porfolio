import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicWorkProcessStep } from '../../../../admin/services/models/dto/service.dto';
import { HomeCopy } from '../../models/home-page.model';

@Component({
  selector: 'app-work-process-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (steps().length) {
      <section class="home-section" id="method" aria-labelledby="home-method-title">
        <div class="home-section__intro">
          <p class="home-eyebrow">{{ copy().methodEyebrow }}</p>
          <h2 id="home-method-title">{{ copy().methodTitle }}</h2>
        </div>

        <ol class="home-method-grid">
          @for (step of steps(); track step.title + step.displayOrder; let index = $index) {
            <li class="home-card home-method-card">
              <span class="home-method-card__number" aria-hidden="true">{{ index + 1 }}</span>
              <div class="home-method-card__heading">
                @if (step.icon) {
                  <i [class]="step.icon" aria-hidden="true"></i>
                }
                <h3>{{ step.title }}</h3>
              </div>
              @if (step.description) {
                <p>{{ step.description }}</p>
              }
              @if (step.expectedResult) {
                <p class="home-method-card__result">
                  <span>{{ copy().expectedResult }}</span>
                  {{ step.expectedResult }}
                </p>
              }
            </li>
          }
        </ol>
      </section>
    }
  `,
})
export class WorkProcessSectionComponent {
  readonly steps = input.required<readonly PublicWorkProcessStep[]>();
  readonly copy = input.required<HomeCopy>();
}
