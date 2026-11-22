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
  type = "text",
  placeholder,
  ...props
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
        type={type}
        placeholder={placeholder}
        className={c("form-control", {
          "is-invalid": (!!field && !!fieldErrors?.[field]) || error,
        })}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ backgroundColor: "var(--color-gray-100)" }}
        {...props}
      />
      <div className="invalid-feedback">
        {fieldErrors && fieldErrors[field]}
        {error && error}
      </div>
    </div>
  );
}

export default ValidateInput;
