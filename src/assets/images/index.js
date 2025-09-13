import avatar from "../images/avatars/avatar.jpg";
import imageForm from "../images/auth/forms/images-form.png";
import Logo from "../images/logos/Logo.png";
import styles from "./index.module.css";
import classNames from "classnames/bind";

const c = classNames.bind(styles);

export const Image = ({
  onClick,
  isCircled,
  size,
  src,
  alt = "",
  width,
  height,
  style,
  className,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={c("img-wrapper", className)}
      style={{
        width: width || size,
        height: height || size,
        ...style,
        borderRadius: isCircled ? "100px" : "",
      }}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export const Background = ({
  src,
  width = "100%",
  height = "100%",
  style = {},
  className,
  children,
}) => {
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: { width },
        height: { height },
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Images = {
  avatar,
  imageForm,
  Logo,
};
