import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames/bind";
import ProfileCard from "@components/ProfileCard/ProfileCard";
import styles from "./ProfileHoverCard.module.css";

const c = classNames.bind(styles);

function ProfileHoverCard({
  user,
  friendStatus,
  setFriendStatus,
  children,
  openDelay = 300,
  closeDelay = 200,
  disabled = false,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placeAbove: false });

  const triggerRef = useRef(null);
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const clearTimers = () => {
    clearTimeout(openTimerRef.current);
    clearTimeout(closeTimerRef.current);
  };

  useEffect(() => () => clearTimers(), []);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const cardWidth = 340;
    const estimatedHeight = 420;
    const gap = 10;

    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

    let left = rect.left;
    if (left + cardWidth > window.innerWidth - 16) {
      left = window.innerWidth - cardWidth - 16;
    }
    if (left < 16) left = 16;

    const top = placeAbove ? rect.top - gap : rect.bottom + gap;

    setCoords({ top, left, placeAbove });
  };

  const handleMouseEnter = () => {
    if (disabled || !user) return;
    clearTimeout(closeTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
    }, openDelay);
  };

  const handleMouseLeave = () => {
    clearTimeout(openTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  };

  const handleCardEnter = () => {
    clearTimeout(closeTimerRef.current);
  };

  return (
    <>
      <span
        ref={triggerRef}
        className={c("triggerWrap", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>

      {isOpen &&
        createPortal(
          <div
            className={c("popoverLayer", { placeAbove: coords.placeAbove })}
            style={{ top: coords.top, left: coords.left }}
            onMouseEnter={handleCardEnter}
            onMouseLeave={handleMouseLeave}
          >
            <ProfileCard
              user={user}
              friendStatus={friendStatus}
              setFriendStatus={setFriendStatus}
              className={c("floatingCard")}
            />
          </div>,
          document.body
        )}
    </>
  );
}

export default ProfileHoverCard;
