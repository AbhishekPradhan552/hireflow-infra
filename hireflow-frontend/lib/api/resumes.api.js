import { fetcher } from "../fetcher";

export const uploadResume = (candidateId, formData) =>
  fetcher(`/candidates/${candidateId}/resumes`, {
    method: "POST",
    body: formData,
    headers: {}, // override JSON header for multipart
  });

export const getResume = (resumeId) => fetcher(`/resumes/${resumeId}`);

export const getResumeDownloadUrl = (resumeId) =>
  fetcher(`/resumes/${resumeId}/download-url`);

export const deleteResume = (resumeId) =>
  fetcher(`/resumes/${resumeId}`, {
    method: "DELETE",
  });

export const reparseResume = (resumeId) =>
  fetcher(`/resumes/${resumeId}/reparse`, {
    method: "POST",
  });
