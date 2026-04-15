import { fetcher } from "../fetcher";

// Create invite
export const createInvite = async ({ email, role }) => {
  return fetcher("/org/invites", {
    method: "POST",
    body: JSON.stringify({
      email,
      role,
      expiresInDays: 7,
    }),
  });
};

// Accept invite (new user)
export const acceptInvite = async ({ token, email, password }) => {
  return fetcher("/auth/accept-invite", {
    method: "POST",
    body: JSON.stringify({ token, email, password }),
  });
};

// Accept invite (logged in user)
export const acceptInviteAuthenticated = async ({ token }) => {
  return fetcher("/auth/accept-invite/authenticated", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};
