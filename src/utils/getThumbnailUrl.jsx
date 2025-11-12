const { API_URL } = require("@config/apiConfig");

export function getThumbnailUrl(thumbnail) {
  if (!thumbnail) return;

  // nếu path bắt đầu bằng "/", nghĩa là relative path trên server
  if (thumbnail.startsWith("/")) {
    return `${API_URL}${thumbnail}`;
  }

  // nếu không bắt đầu bằng "/", coi như là external URL
  return thumbnail;
}
