import { fetcher } from "../fetcher";

export const getJobs = ({
  status = "all",
  page = 1,
  limit = 10,
  search = "",
} = {}) => {
  const params = new URLSearchParams();

  if (status && status !== "all") {
    params.append("status", status);
  }

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search?.trim()) {
    params.append("search", search.trim());
  }

  const query = params.toString();

  return fetcher(`/jobs${query ? `?${query}` : ""}`);
};

export const getJobById = (id) => fetcher(`/jobs/${id}`);

export const createJob = (data) =>
  fetcher("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateJob = (id, data) =>
  fetcher(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteJob = (id) =>
  fetcher(`/jobs/${id}`, {
    method: "DELETE",
  });

export const getJobStats = (jobId) => fetcher(`/jobs/${jobId}/stats`);

export const getCandidatePipeline = (jobId) =>
  fetcher(`/jobs/${jobId}/pipeline`);

// TOGGLE STATUS
export const updateJobStatus = (id, status) =>
  fetcher(`/jobs/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
