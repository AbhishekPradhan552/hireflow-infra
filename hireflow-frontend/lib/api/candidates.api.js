import { fetcher } from "../fetcher";

export const getAllCandidates = () => fetcher("/candidates");

export const getCandidatesByJob = (
  jobId,
  { page = 1, limit = 10, search = "", sort = "latest" } = {},
) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  if (search?.trim()) {
    params.append("search", search.trim());
  }

  if (sort && sort !== "latest") {
    params.append("sort", sort);
  }

  const query = params.toString();

  return fetcher(`/jobs/${jobId}/candidates${query ? `?${query}` : ""}`);
};

export const rankedCandidates = (jobId) =>
  fetcher(`/jobs/${jobId}/candidates/ranked`);

export const createCandidate = (jobId, data) =>
  fetcher(`/jobs/${jobId}/candidates`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getCandidateById = (id) => fetcher(`/candidates/${id}`);

export const updateCandidate = (id, data) =>
  fetcher(`/candidates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const updateCandidateStatus = (id, status) =>
  fetcher(`/candidates/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteCandidate = (id) =>
  fetcher(`/candidates/${id}`, {
    method: "DELETE",
  });
