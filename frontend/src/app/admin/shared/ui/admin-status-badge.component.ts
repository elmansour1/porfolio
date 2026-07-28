import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AdminStatusBadgeTone = 'ready' | 'unavailable' | 'warning' | 'secure';

@Component({
  selector: 'app-admin-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="admin-status-badge" [class]="toneClass()">
      <span class="admin-status-badge__dot" aria-hidden="true"></span>
      {{ label() }}
    </span>
  `,
})
export class AdminStatusBadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<AdminStatusBadgeTone>('ready');

  readonly toneClass = computed(() => `admin-status-badge--${this.tone()}`);
}
