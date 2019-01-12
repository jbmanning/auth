const API_URL = "https://api.jman.me/auth";

export const SIGNUP_URL = `${API_URL}/signup`;
export const LOGIN_URL = `${API_URL}/login`;
export const DEFAULT_FETCH_PROPS = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};
