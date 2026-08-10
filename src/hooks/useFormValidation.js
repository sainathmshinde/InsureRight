import { useState, useCallback } from "react";

// Generic required-field (+ optional custom rule) validation for a plain
// `form` state object. Errors are derived from the current form values on
// every call — nothing is cached — so a field clears the moment its value
// becomes valid, without waiting for another blur.
//
// rules: {
//   [fieldName]: {
//     required?: boolean | string,          // true → "<label> is required", or pass a custom message
//     label?: string,                       // used in the default required message
//     validate?: (value, form) => string,   // return an error message, or "" / falsy when valid
//   }
// }
//
// Errors only become visible once a field has been blurred at least once,
// or the form has been submitted — so nothing turns red before the user has
// had a chance to fill anything in.
export function useFormValidation(form, rules) {
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const isEmpty = (value) =>
    value === "" ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0);

  const errorFor = useCallback(
    (name) => {
      const rule = rules[name];
      if (!rule) return "";
      const value = form[name];
      if (rule.required && isEmpty(value)) {
        return typeof rule.required === "string"
          ? rule.required
          : `${rule.label ?? "This field"} is required`;
      }
      if (rule.validate) {
        return rule.validate(value, form) || "";
      }
      return "";
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, rules],
  );

  const shownError = (name) => ((touched[name] || submitted) ? errorFor(name) : "");

  const fieldProps = (name) => ({
    error: shownError(name),
    onBlur: () => setTouched((t) => (t[name] ? t : { ...t, [name]: true })),
    onFocus: () => {},
  });

  // Marks every rule as "submitted" (so every error becomes visible at
  // once) and reports whether the form is valid as of right now.
  const validateAll = () => {
    setSubmitted(true);
    return Object.keys(rules).every((name) => !errorFor(name));
  };

  const reset = () => {
    setTouched({});
    setSubmitted(false);
  };

  return { fieldProps, validateAll, errorFor, reset };
}
