import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-admin-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="admin-empty-state" [attr.aria-labelledby]="titleId()">
      <span class="admin-empty-state__icon" aria-hidden="true">
        <i [class]="icon()"></i>
      </span>
      <div>
        <h2 [id]="titleId()">{{ title() }}</h2>
        <p>{{ description() }}</p>
      </div>
    </section>
  `,
})
export class AdminEmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input('pi pi-info-circle');
  readonly titleId = input('admin-empty-state-title');
}
