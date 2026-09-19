import axios from "axios";

// The backend runs on port 8000 by default (see README for exact
// uvicorn command). Override with a .env file (VITE_API_BASE_URL) if needed.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Friendly error normalizer. Every failure mode (network down, backend
 * down, validation error, unexpected server error) is turned into a
 * single shape { message, status } the UI can render consistently.
 */
function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 422 && data?.detail) {
      const details = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg || JSON.stringify(d)).join("; ")
        : data.detail;
      return { status, message: `Please check your inputs: ${details}` };
    }
    if (status === 503) {
      return {
        status,
        message:
          data?.detail ||
          "The recommendation model isn't available on the server right now. Please try again shortly.",
      };
    }
    return {
      status,
      message: data?.detail || "Something went wrong while talking to the server.",
    };
  }
  if (error.request) {
    return {
      status: 0,
      message:
        "Couldn't reach the backend API. Make sure it's running (see README) and try again.",
    };
  }
  return { status: -1, message: error.message || "An unexpected error occurred." };
}

export async function checkHealth() {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getCareerRecommendations(payload) {
  try {
    const response = await apiClient.post("/api/recommend", payload);
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export default apiClient;
