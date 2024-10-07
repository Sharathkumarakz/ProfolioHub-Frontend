import { Injectable } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  static matchingText: string;

  public static getValidationErrorMessage(
    validatorName: string,
    validatorValue?: ValidationErrors[string],
    labelName?: string
  ): string | undefined {
    const data = {
      required: labelName === '' ? 'This field is required' : labelName,
      invalidPassword: `Invalid password. Password must be at least 6 characters long, and contain a number.`,
      invalidEmailAddress: `Invalid email address`,
      invalidPhoneNumber: `Invalid phone number.`,
      invalidPhoneLength: 'This field requires 10 digits',
      invalidRoutingNumber: `Invalid Routing Number`,
      invalidAccountNumber: `Invalid Account Number`,
      invalidUrl: `Invalid URL`,
      invalidZip: `Enter valid zip.`,
      minlength: `The field must contain at least ${validatorValue.requiredLength} characters.`,
      maxlength: `The field can't contain more than ${validatorValue.requiredLength} characters.`,
      min: `Minimum value must be ${validatorValue.min}`,
      max: `Maximum value must be ${validatorValue.max}`,
      hasWhitespace: 'This field has whitespace',
      accountNoMismatch: 'Incorrect account number',
      pattern: '',
      poBox: 'PO Box address not allowed',
      invalidMatch: this.matchingText,
      specialChar: 'Special characters are not allowed',
      achVerificationRequired: 'Bank Account is not ACH verified',
      passwordMismatch: 'Passwords are not same',
      accountNumberMismatch: 'Account Number are not same',
    };

    if (validatorName === 'pattern') {
      if (validatorValue?.requiredPattern === '^[a-zA-Z0-9 ]+$') {
        data.pattern =
          'The field must contain characters, numbers and spaces only.';
      }
    }
    const vName = validatorName as keyof typeof data;

    return data[vName];
  }

  // PASSWORD
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    // (?!.*\s)          - Spaces are not allowed
    return control.value.match(
      /^(?=.*\d)(?=.*[a-zA-Z!@#$%^&*])(?!.*\s).{6,100}$/
    )
      ? null
      : { invalidPassword: true };
  }

  // EMAIL
  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = String(control.value);

    if (control.value === null || control.value === '') {
      return null;
    }
    // if (!control.value) { return { invalidEmailAddress: true }; }

    if (email.match(/^([\w-.]+@([\w-]+\.)+[\w-]{2,15})?$/)) {
      return null;
    }

    return { invalidEmailAddress: true };
  }

  static isMatchingValidator(
    confirmInput: string,
    matchingTextFromComponent: string
  ): any {
    let checkingFieldOne: UntypedFormControl;
    let checkingFieldTwo: UntypedFormControl;
    this.matchingText = matchingTextFromComponent;

    return (control: UntypedFormControl) => {
      if (!control.parent) {
        return null;
      }

      if (!checkingFieldOne) {
        checkingFieldOne = control;
        checkingFieldTwo = control.parent.get(
          confirmInput
        ) as UntypedFormControl;
        checkingFieldTwo.valueChanges.subscribe(() => {
          checkingFieldOne.updateValueAndValidity();
        });
      }

      if (
        checkingFieldTwo?.value?.toString().toLocaleLowerCase() !==
        checkingFieldOne?.value?.toString().toLocaleLowerCase()
      ) {
        return {
          invalidMatch: true,
        };
      }

      return null;
    };
  }

  // PHONE NUMBER

  static phoneNumberValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const masknum = control.value;
    const num = String(control.value);

    const num1 = num.substring(0, 3);
    const num2 = num.substring(3, 6);
    const num3 = num.substring(6, 10);

    const number = `(${num1}) ${num2}-${num3}`;
    if (control.value === null || control.value === '') {
      return { invalidPhoneNumber: false };
    }
    if (!number) {
      return { invalidPhoneNumber: true };
    }

    if (
      number.match(/(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/g) ||
      masknum.match(/(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/g)
    ) {
      return { invalidPhoneNumber: false };
    }
    return { invalidPhoneNumber: true };
  }

  // ZIP VALIDATION
  static zipValidator(control: AbstractControl): ValidationErrors | null {
    const zip = String(control.value);
    if (control.value === null || control.value === '') {
      return { invalidZip: false };
    }
    if (control.value.length < 5 || control.value.length > 10) {
      return { invalidZip: false };
    }

    if (zip.match(/[^A-Za-z\d  -]/)) {
      return { invalidZip: false };
    }
    return { invalidZip: true };
  }

  static zipValidatorInternational(
    control: AbstractControl
  ): ValidationErrors | null {
    const zip = String(control.value);
    if (control.value === null || control.value === '') {
      return { invalidZip: false };
    }
    if (control.value.length < 5 || control.value.length > 10) {
      return { invalidZip: false };
    }

    if (zip.match(/[!@#$%^&*()_+=\\[\]{};':"\\|,.<>\\/?]/)) {
      return { invalidZip: false };
    }
    return { invalidZip: true };
  }

  static specialCharValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const inputValue = String(control.value);
    if (control.value === null || control.value === '') {
      return { specialChar: false };
    }

    if (inputValue.match(/[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/)) {
      return { specialChar: false };
    }
    return { specialChar: true };
  }

  static routingNumberValidator(control: AbstractControl): any {
    // Run through each digit and calculate the total.
    let n = 0;
    const rtNumber = control.value;

    if (control.value === null || control.value === '') {
      return true;
    }
    for (let i = 0; i < rtNumber.length; i += 3) {
      n +=
        parseInt(rtNumber.charAt(i), 10) * 3 +
        parseInt(rtNumber.charAt(i + 1), 10) * 7 +
        parseInt(rtNumber.charAt(i + 2), 10);
    }
    // If the resulting sum is an even multiple of ten (but not zero),
    // the aba routing number is good.

    if (n !== 0 && n % 10 === 0) {
      return false;
    }
    return { invalidRoutingNumber: false };
  }

  // WHITE SPACE ERROR
  static noWhitespaceValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { hasWhitespace: true };
  }

  /**
   * @description method to validate no whitespace and pass message as field is required
   */
  static whitespaceValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { required: true };
  }

  // URL VALIDATOR
  static isUrlValid(control: AbstractControl): ValidationErrors | null {
    const res = control?.value?.match(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/
    );

    if (!res && control?.value) return { invalidUrl: true };
    return { invalidUrl: false };
  }

  // GET VALIDATION ERRORS
  getValidationError(
    control: AbstractControl,
    labelName?: string
  ): string | undefined {
    if (control.errors) {
      Object.keys(control.errors).forEach((propertyName) => {
        if (
          Object.prototype.hasOwnProperty.call(control.errors, propertyName) &&
          control.touched
        ) {
          return ValidationService.getValidationErrorMessage(
            propertyName,
            control.errors?.[propertyName],
            labelName
          );
        }
        return undefined;
      });
    }
    return undefined;
  }

  // ************************************convert format***********************************************

  // REMOVE WHITE SPACE
  isNullOrWhitespace(input: string): boolean {
    return !input || !input.trim();
  }

  // FORMATE CURRENCY
  formateCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // ALLOW NUMBER ONLY
  public static numberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // FORMATE PERCENTAGE
  formateToPercentage(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  /**
   * allows number only
   */
  allowNumberOnly(event: KeyboardEvent) {
    const k = event.key.charCodeAt(0);
    if (k < 48 || k > 57) {
      event.preventDefault();
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.root.get('password');
    const confirmPassword = control.value;

    if (password && confirmPassword && password.value !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  accountNumberMatchValidator(control: AbstractControl) {
    const password = control.root.get('account_number');
    const confirmAccountNumber = control.value;

    if (
      password &&
      confirmAccountNumber &&
      password.value !== confirmAccountNumber
    ) {
      return { accountNumberMismatch: true };
    }
    return null;
  }
}
export function AccuntNoValidator(accountNo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // proper accountno check
    if (accountNo?.length > 4 && control.value === accountNo) {
      return null;
    }
    // accountno not available
    if (!accountNo || accountNo.length < 4 || !control.value) {
      return null;
    }
    // accountno with last 4 digits available
    // 'xxxx' are removed earlear from accountno
    if (
      accountNo &&
      accountNo.length === 4 &&
      control.value.length >= 4 &&
      control.value.substr(-4) === accountNo
    ) {
      return null;
    }

    return { accountNoMismatch: true };
  };
}
