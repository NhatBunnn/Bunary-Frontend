import { useId } from "react";
import styles from "./ValidateInput.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

function ValidateInput({
  field,
  fieldErrors,
  error,
  onChange,
  value,
  label,
  className,
}) {
  const id = useId();

  return (
    <div className={c("mb-3 w-100", className)}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        className={c("form-control", {
          "is-invalid": (!!field && !!fieldErrors?.[field]) || error,
        })}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="invalid-feedback">
        {fieldErrors && fieldErrors[field]}
        {error && error}
      </div>
    </div>
  );
}

export default ValidateInput;
