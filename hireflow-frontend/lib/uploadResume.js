import { fetcher } from "@/lib/fetcher";

export const uploadResume = async ({ file, candidateId }) => {
  // 1. get presigned url (✅ use fetcher)
  const { uploadUrl, key } = await fetcher("/uploads/presigned-url", {
    method: "POST",
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      candidateId,
    }),
  });

  // 2. upload to S3 (❌ DO NOT use fetcher here)
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  // 3. notify backend (✅ use fetcher again)
  const resume = await fetcher(`/candidates/${candidateId}/resumes/direct`, {
    method: "POST",
    body: JSON.stringify({
      key,
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    }),
  });

  return resume;
};
