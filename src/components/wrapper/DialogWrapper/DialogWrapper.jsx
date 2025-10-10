import TitleSection from "@components/TitleSection";
import styles from "./DialogWrapper.module.css";
import { bindClass } from "@utils/classnames";
import Button from "@components/Button";
import DialogOverlay from "../DialogOverlay";

const c = bindClass(styles);

function DialogWrapper({ children, title, className }) {
  return (
    <DialogOverlay>
      <div className={c("dialogWrapper", "p-3", className)}>
        <TitleSection title={title}></TitleSection>
        <hr />
        {children}
      </div>
    </DialogOverlay>
  );
}

export default DialogWrapper;
