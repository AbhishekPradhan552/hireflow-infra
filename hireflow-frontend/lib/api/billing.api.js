import { fetcher } from "../fetcher";

export async function getCurrentSubscription() {
  return fetcher("/billing/current");
}
export async function getUsage() {
  return fetcher("/org/usage");
}

export async function upgradePlan(plan) {
  return fetcher("/billing/upgrade", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
}

export async function cancelSubscription() {
  return fetcher("/billing/cancel", {
    method: "POST",
  });
}
