import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AdminStatusBadgeComponent, AdminStatusBadgeTone } from './admin-status-badge.component';

@Component({
  selector: 'app-admin-metric-card',
  imports: [AdminStatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="admin-metric-card" [attr.aria-labelledby]="labelId()">
      <div class="admin-metric-card__header">
        <span class="admin-metric-card__icon" aria-hidden="true">
          <i [class]="icon()"></i>
        </span>
        <app-admin-status-badge [label]="statusLabel()" [tone]="statusTone()" />
      </div>
      <div>
        <p [id]="labelId()" class="admin-metric-card__label">{{ label() }}</p>
        <p class="admin-metric-card__value">{{ value() }}</p>
        <p class="admin-metric-card__description">{{ description() }}</p>
      </div>
    </article>
  `,
})
export class AdminMetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input.required<string>();
  readonly statusLabel = input.required<string>();
  readonly statusTone = input<AdminStatusBadgeTone>('ready');
  readonly labelId = input.required<string>();
}
