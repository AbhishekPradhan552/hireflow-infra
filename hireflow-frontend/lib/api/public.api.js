import { fetcher } from "../fetcher";

export const applyToJob = async (jobId, data) => {
  const res = await fetcher(`/api/public/jobs/${jobId}/apply`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res; // ✅ RETURN FULL RESPONSE
};

export const getPublicJob = async (jobId) => {
  const res = await fetcher(`/api/public/jobs/${jobId}`);
  return res.data;
};

export const getPresignedUrl = async ({ fileName, fileType, jobId }) => {
  const res = await fetcher("/api/public/uploads/presigned-url", {
    method: "POST",
    body: JSON.stringify({
      fileName,
      fileType,
      jobId,
    }),
  });

  return res;
};

export const savePublicResume = async (data) => {
  const res = await fetcher("/api/public/resumes/direct", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
};
