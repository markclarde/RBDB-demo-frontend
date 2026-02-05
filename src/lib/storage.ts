const REMEMBER_ME_KEY = "remember_me";

export function setRememberMe(remember: boolean) {
  localStorage.setItem(REMEMBER_ME_KEY, remember ? "true" : "false");
}

export function getRememberMe() {
  return localStorage.getItem(REMEMBER_ME_KEY) === "true";
}

export function clearRememberMe() {
  localStorage.removeItem(REMEMBER_ME_KEY);
}
