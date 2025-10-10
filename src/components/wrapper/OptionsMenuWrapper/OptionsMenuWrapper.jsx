import { bindClass } from "@utils/classnames";
import styles from "./OptionsMenuWrapper.module.css";
import { forwardRef } from "react";

const c = bindClass(styles);

const OptionsMenuWrapper = forwardRef(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={c(
        "optionsMenuWrapper",
        "d-flex",
        "flex-column",
        "p-2",
        className
      )}
    >
      {children}
    </div>
  );
});

export default OptionsMenuWrapper;
