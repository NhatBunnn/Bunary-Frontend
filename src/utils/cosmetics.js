import { useEffect, useState } from "react";
import { useUser } from "@context/UserProvider/UserProvider";

const STORAGE_KEY = "bunary_equipped_cosmetics";
export const COSMETICS_UPDATED_EVENT = "bunary:cosmetics-updated";

export const BANNER_STYLES = {
  bnSlate: "linear-gradient(125deg, #334155, #475569)",
  bnSunset: "linear-gradient(135deg, #4c1d95, #be185d, #f97316)",
  bnAurora: "linear-gradient(135deg, #0f766e, #0284c7, #6366f1)",
};

export const EFFECT_STYLES = {
  fxEmerald:
    "linear-gradient(180deg, rgba(16, 185, 129, 0.14) 0%, transparent 55%)",
  fxTwilight:
    "radial-gradient(circle at 85% 15%, rgba(99, 102, 241, 0.18), transparent 55%), radial-gradient(circle at 15% 85%, rgba(236, 72, 153, 0.12), transparent 55%)",
};

export const NAMEPLATE_COLORS = {
  npIndigo: "#4f46e5",
  npAmber: "#b45309",
};

export function loadEquippedCosmetics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveEquippedCosmetics(cosmetics) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cosmetics || {}));
    window.dispatchEvent(
      new CustomEvent(COSMETICS_UPDATED_EVENT, { detail: cosmetics || {} })
    );
  } catch {
    // ignore storage errors
  }
}

export function useEquippedCosmetics(targetUser) {
  const { user: currentUser } = useUser() || {};
  const [localCosmetics, setLocalCosmetics] = useState(() =>
    loadEquippedCosmetics()
  );

  useEffect(() => {
    const onUpdate = (e) =>
      setLocalCosmetics(e.detail || loadEquippedCosmetics());
    window.addEventListener(COSMETICS_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(COSMETICS_UPDATED_EVENT, onUpdate);
  }, []);

  const isMe =
    Boolean(targetUser?.id && currentUser?.id && targetUser.id === currentUser.id) ||
    (!targetUser?.id && !currentUser?.id);

  const avatarFrame =
    targetUser?.avatarFrame ||
    targetUser?.avatarDecoKey ||
    (isMe ? localCosmetics.avatarFrame : null);
  const bannerTheme =
    targetUser?.bannerTheme || (isMe ? localCosmetics.bannerTheme : null);
  const profileEffect =
    targetUser?.profileEffect || (isMe ? localCosmetics.profileEffect : null);
  const nameplate =
    targetUser?.nameplate || (isMe ? localCosmetics.nameplate : null);

  return {
    avatarFrame,
    bannerTheme,
    profileEffect,
    nameplate,
    nameColor: nameplate ? NAMEPLATE_COLORS[nameplate] : null,
  };
}
