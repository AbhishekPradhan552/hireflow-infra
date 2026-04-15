export function formatJobDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const isSameYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(isSameYear ? {} : { year: "numeric" }),
  });
}
