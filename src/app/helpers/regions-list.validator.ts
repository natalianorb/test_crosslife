import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function regionsListValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const regions = control.value;
  return regions.length < 2 ? { tooShort: { value: control.value } } : null;
}
