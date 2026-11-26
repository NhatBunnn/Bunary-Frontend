import { API_URL } from "@config/apiConfig";

const FRONTEND_ASSET_PREFIXES = ["/src/", "/assets/", "/@", "/node_modules/"];

export function getThumbnailUrl(thumbnail) {
  if (!thumbnail || typeof thumbnail !== "string") return "";

  const trimmed = thumbnail.trim();
  if (!trimmed) return "";

  // External URLs, data URIs, blob URLs
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Protocol-relative URLs (e.g. //cdn.example.com/img.png)
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  // Local Vite frontend assets (dev: /src/..., /@fs/...; prod: /assets/...)
  if (FRONTEND_ASSET_PREFIXES.some((prefix) => trimmed.startsWith(prefix))) {
    return trimmed;
  }

  // Relative path on backend server (e.g. /uploads/..., /api/...)
  if (trimmed.startsWith("/")) {
    return `${API_URL}${trimmed}`;
  }

  return trimmed;
}
