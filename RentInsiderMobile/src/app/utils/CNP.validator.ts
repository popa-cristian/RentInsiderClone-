import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

function computeControlDigit(cnp: string): number
{
    let result: number = 0;
    const templateCNP = "279146358279"; //the template CNP defined by the authorities
    for(let i=0; i<12; i++)
    {
        let firstDigit = parseInt(cnp[i]);//the digit from the given CNP
        let secondDigit = parseInt(templateCNP[i]);//the coresponding digit from the template CNP
        result += firstDigit*secondDigit;
    }
    result %= 11;
    if(result === 10)
        result = 1;
    return result;
}

/**
 * VerifyCNP - it's a function factory that builds a ValidatorFn that checks if a RO CNP (personal numerical code) is valid
 * this checks both the pattern of the CNP and the control digit
 * @returns a ValidatorFn that does the validation of the CNP by the following algorithm:
 * tests CNP against a RegEx. if the CNP doesn't match that basic pattern, a map that looks like this: {patternMismatch: {value: "field value"}} is returned
 * computes the control digit like https://docerp.ro/validarea-unui-cnp/ this algorithm does. If the control digit of the first 12 digits doesn't match the 13th digit, {controlDigitError: {value: "field value"}} is returned
 * return null if everything is alright
 */
export function VerifyCNP() : ValidatorFn
{
    return (control: AbstractControl): ValidationErrors | null =>
    {
        const value = control.value as string; // we get the value from the input
        const pattern = new RegExp("^[0-9]{13}$"); // hope you like regexes. I do like them, and you might see them a few times in here
        if(!pattern.test(value))//CNP template test (has to have only 13 digits)
            return {patternMismatch: {value: value}};
        if(computeControlDigit(value) !== parseInt(value[12])) //The control digit is incorrect
            return {controlDigitError: {value: value}}
        return null;
    }
}