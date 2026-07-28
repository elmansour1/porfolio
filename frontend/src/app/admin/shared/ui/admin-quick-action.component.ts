import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-quick-action',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (disabled()) {
      <button class="admin-quick-action admin-quick-action--disabled" type="button" disabled>
        <span class="admin-quick-action__icon" aria-hidden="true">
          <i [class]="icon()"></i>
        </span>
        <span>
          <strong>{{ label() }}</strong>
          <small>{{ description() }}</small>
        </span>
      </button>
    } @else {
      <a class="admin-quick-action" [routerLink]="route()">
        <span class="admin-quick-action__icon" aria-hidden="true">
          <i [class]="icon()"></i>
        </span>
        <span>
          <strong>{{ label() }}</strong>
          <small>{{ description() }}</small>
        </span>
      </a>
    }
  `,
})
export class AdminQuickActionComponent {
  readonly label = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input.required<string>();
  readonly route = input('/');
  readonly disabled = input(false);
}
