import styles from "./ValidateInput.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function ValidateInput({
  fieldErrors,
  errors,
  onChange,
  value,
  label,
  name,
  type,
  className,
}) {
  return (
    <div className={c("mb-3 w-100", className)}>
      {label && (
        <label htmlFor={`input-${name}`} className="form-label">
          {label}
        </label>
      )}
      <input
        type={type}
        className={c("form-control", {
          "is-invalid":
            (errors && errors.length) ||
            (fieldErrors && (fieldErrors.credential || fieldErrors[name])),
        })}
        id={`input-${name}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="invalid-feedback">
        {fieldErrors && fieldErrors[name]}
        {fieldErrors && fieldErrors.credential}
        {errors}
      </div>
    </div>
  );
}

export default ValidateInput;
