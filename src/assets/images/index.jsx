import { useEffect, useState } from "react";
import avatar from "../images/avatars/avatar.jpg";
import imageForm from "../images/auth/forms/images-form.png";
import Logo from "../images/logos/Logo.png";
import noImage from "../images/common/no-image.png";
import flashCardNoImageSmall from "../images/flashcard/no-image-large.png";
import flashCardNoImageLarge from "../images/flashcard/no-image-large.png";
import styles from "./index.module.css";
import classNames from "classnames/bind";
import { getThumbnailUrl } from "@utils/getThumbnailUrl";

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
  fallback = noImage,
  loading = "lazy",
  ...props
}) => {
  const resolveSrc = (source) => {
    if (!source) return fallback;
    return getThumbnailUrl(source) || fallback;
  };

  const [currentSrc, setCurrentSrc] = useState(() => resolveSrc(src));

  useEffect(() => {
    setCurrentSrc(resolveSrc(src));
  }, [src, fallback]);

  const handleError = () => {
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  return (
    <div
      onClick={onClick}
      className={c("img-wrapper", className)}
      style={{
        width: width || size,
        height: height || size,
        ...style,
        borderRadius: isCircled ? "50%" : "",
      }}
      {...props}
    >
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onError={handleError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};

export const AppImage = Image;

export const Background = ({
  src,
  width = "100%",
  height = "100%",
  style = {},
  className,
  children,
}) => {
  const finalSrc = getThumbnailUrl(src) || src || noImage;
  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${finalSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
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
  noImage,
  // flashcard
  flashCardNoImageSmall,
  flashCardNoImageLarge,
};

export default Image;
