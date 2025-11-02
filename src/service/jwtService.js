// src/services/jwtService.js
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    // JWT format: header.payload.signature
    const payload = token.split(".")[1];
    if (!payload) return null;

    // Base64 decode
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

    // Parse JSON
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

// Example: get role from token
export const getRoleFromToken = (token) => {
  const decoded = decodeJWT(token);
  return decoded?.role || null; // tùy backend bạn lưu key role là gì
};
