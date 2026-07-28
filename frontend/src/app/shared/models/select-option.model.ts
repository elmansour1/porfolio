export interface SelectOption<TValue extends string | number | boolean> {
  readonly label: string;
  readonly value: TValue;
  readonly disabled?: boolean;
}
