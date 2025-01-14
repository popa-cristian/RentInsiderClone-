import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * VerifyPhoneNr() - it's a function factory that builds a ValidatorFn that checks a phone number
 * @returns a ValidatorFn that does the validation of the phone number after a pattern
 */
export function VerifyPhoneNr() : ValidatorFn
{
    return (control: AbstractControl): ValidationErrors | null =>
    {
        const value = control.value as string; //getting the value from input
        const pattern = new RegExp("[+]?[0-9]{0,2}[\s]?[0-9]{4}[\s]?[0-9]{3}[\s]?[0-9]{3}"); 
        if(!pattern.test(value))
            return {patternMismatch: {value: value}};
        return null;
    }
}