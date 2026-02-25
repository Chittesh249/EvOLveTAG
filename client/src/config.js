/**
 * Frontend config. REACT_APP_* are set at build time from .env.
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "/api";

/** Origin for absolute URLs (e.g. paper download/view). */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
