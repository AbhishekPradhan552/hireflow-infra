import { getToken } from "./auth/token";

export async function fetcher(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await res.json();
  } catch {}

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
}
