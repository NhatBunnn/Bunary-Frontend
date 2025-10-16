import { API_URL } from "../config/apiConfig";

export async function getAccessToken() {
  const accessToken = sessionStorage.getItem("access_token");

  if (accessToken) {
    const decodedToken = parseJwt(accessToken);
    const expiresAt = decodedToken?.exp * 1000;

    if (expiresAt && new Date().getTime() < expiresAt) {
      sessionStorage.setItem("access_token", accessToken);

      return accessToken;
    }
  }
  return await getNewAccessToken();
}

async function getNewAccessToken() {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/refresh-Token`, {
      method: "GET",
      credentials: "include",
    });
    const dataResponse = await res.json();

    if (dataResponse) {
      sessionStorage.setItem("access_token", dataResponse.data.accessToken);
      return dataResponse.data.accessToken;
    }
  } catch (error) {
    console.error(error);
  }
}

export function getRefreshToken() {
  return fetch(`${API_URL}/auth/refreshToken`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((dataReponse) => {
      if (dataReponse?.data?.accessToken) {
        console.log("acesstoken thành công");
        sessionStorage.setItem("access_token", dataReponse.data.accessToken);
        console.log("Accesstoken là: " + dataReponse.data.accessToken);
        console.log("RrefreshToken là: " + dataReponse.data.refreshToken);
        return dataReponse.data.accessToken;
      } else {
        throw new Error("Đăng nhập thất bại");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

export function parseJwt(token) {
  if (!token) {
    console.error("Token không tồn tại hoặc không hợp lệ");
    return null;
  }

  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function getCurrentEmail() {
  const accessToken = sessionStorage.getItem("access_token");
  const decodedToken = parseJwt(accessToken);
  return decodedToken.user.email;
}

export function getCurrentUserId() {
  const accessToken = sessionStorage.getItem("access_token");
  const decodedToken = parseJwt(accessToken);
  return decodedToken.sub;
}
