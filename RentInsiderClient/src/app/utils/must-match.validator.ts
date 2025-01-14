import { FormGroup } from '@angular/forms';

export function VerifyMatch(
  controlValue: string,
  matchingControlValue: string
) {
  return (formGroup: FormGroup) => {
    const value = formGroup.controls[controlValue];
    const matchingValue = formGroup.controls[matchingControlValue];
    if (matchingValue.errors && !matchingValue.errors.mustMatch) {
      // return only if another validator found errors on the matchingValue constant
      return;
    }
    // if matchingValue passes all validations but it does not match
    if (value.value !== matchingValue.value) {
      // we set an error
      matchingValue.setErrors({ mustMatch: true });
    }
    // if matchingValue match the value
    else {
      matchingValue.setErrors(null);
    }
  };
}
