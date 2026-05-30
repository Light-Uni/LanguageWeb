/**
 * LinguaFlow API Client
 * Built using native fetch API to avoid extra dependencies,
 * featuring automatic JWT token insertion and auto-refresh on 401.
 */

// In development, the Vite proxy transparently forwards /api/* → http://127.0.0.1:8000
// In production, set BASE_URL to the deployed backend origin.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any, message?: string) {
    super(message || `API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  if (data.refresh) {
    localStorage.setItem("refresh_token", data.refresh);
  }
  return data.access;
}

export async function request(path: string, options: RequestOptions = {}): Promise<any> {
  const url = new URL(`${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  
  // Append query parameters if any
  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined) {
        url.searchParams.append(key, String(val));
      }
    });
  }

  const headers = new Headers(options.headers || {});
  
  // Set default content type
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach access token if present
  const token = localStorage.getItem("access_token");
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url.toString(), fetchOptions);

    if (response.status === 401) {
      // Avoid infinite loop if we are already trying to login/refresh
      if (path === "/api/auth/token/refresh/" || path === "/api/auth/login/") {
        throw new ApiError(response.status, await response.json().catch(() => ({})));
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newAccessToken);
        } catch (refreshErr) {
          isRefreshing = false;
          // Clear auth data and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_info");
          window.dispatchEvent(new Event("auth_expired"));
          throw new Error("Session expired. Please log in again.");
        }
      }

      // Wait for token refresh to complete
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newAccessToken) => {
          headers.set("Authorization", `Bearer ${newAccessToken}`);
          fetch(url.toString(), fetchOptions)
            .then(async (res) => {
              if (!res.ok) {
                reject(new ApiError(res.status, await res.json().catch(() => ({}))));
              } else {
                resolve(res.json().catch(() => ({})));
              }
            })
            .catch(reject);
        });
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData);
    }

    // Return empty object if no content
    if (response.status === 204) {
      return {};
    }

    return await response.json().catch(() => ({}));
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or other errors
    console.error("API Request Failed:", err);
    throw err;
  }
}

// HTTP helper methods
export const api = {
  get: (path: string, params?: Record<string, any>, options?: RequestOptions) => 
    request(path, { method: "GET", params, ...options }),
    
  post: (path: string, body?: any, options?: RequestOptions) => 
    request(path, { 
      method: "POST", 
      body: body instanceof FormData ? body : JSON.stringify(body), 
      ...options 
    }),
    
  put: (path: string, body?: any, options?: RequestOptions) => 
    request(path, { 
      method: "PUT", 
      body: body instanceof FormData ? body : JSON.stringify(body), 
      ...options 
    }),
    
  delete: (path: string, options?: RequestOptions) => 
    request(path, { method: "DELETE", ...options }),

  patch: (path: string, body?: any, options?: RequestOptions) => 
    request(path, { 
      method: "PATCH", 
      body: body instanceof FormData ? body : JSON.stringify(body), 
      ...options 
    }),
};
