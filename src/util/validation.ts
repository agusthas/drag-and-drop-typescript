namespace App {
  /* VALIDATION */

  /**
   * An interface for a validatable Objects
   */
  export interface Validatable {
    /**
     * The value to be validate against each options.
     * @required
     */
    value: string | number;

    /**
     * Determines whether the value should not be empty. _(Optional)_
     */
    required?: boolean;

    /**
     * Determines the minimum length of the value, if value is a string. _(Optional)_
     */
    minLength?: number;

    /**
     * Determines the maximum length of the value, if value is a string. _(Optional)_
     */
    maxLength?: number;

    /**
     * Determines the minimum value of a number it can be _inclusive_, if value is a number. _(Optional)_
     */
    min?: number;

    /**
     * Determines the maximum value of a number it can be _inclusive_, if value is a number. _(Optional)_
     */
    max?: number;
  }

  /**
   * Returns a boolean indicating wheter the value was valid against the options
   * @param obj A validatable object
   */
  export function validate(obj: Validatable) {
    let isValid = true; // default

    if (obj.required) {
      isValid = isValid && obj.value.toString().trim().length !== 0;
    }

    if (obj.minLength != null && typeof obj.value === 'string') {
      isValid = isValid && obj.value.length >= obj.minLength;
    }

    if (obj.maxLength != null && typeof obj.value === 'string') {
      isValid = isValid && obj.value.length <= obj.maxLength;
    }

    if (obj.min != null && typeof obj.value === 'number') {
      isValid = isValid && obj.value >= obj.min;
    }

    if (obj.max != null && typeof obj.value === 'number') {
      isValid = isValid && obj.value <= obj.max;
    }

    return isValid;
  }
}
