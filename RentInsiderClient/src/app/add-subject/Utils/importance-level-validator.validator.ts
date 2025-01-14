import { FormGroup, ValidatorFn } from '@angular/forms';

export function importanceLevelValidator(Required = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    let checked = 0;
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];
      if (control.value === true) {
        checked++;
      }
    });
    if (checked != Required) {
      return {
        importanceLevel: true,
      };
    }
    return null;
  };
}
