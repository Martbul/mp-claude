export const FILE_TYPE_KEYS = [
  "pdf",
  "docx",
  "pptx",
  "xlsx",
  "txt",
  "image",
  "video",
  "audio",
  "code",
  "other",
] as const;

export type FileTypeKey = (typeof FILE_TYPE_KEYS)[number];

export const STATUS_KEYS = ["synced", "syncing", "offline", "error"] as const;
export type StatusKey = (typeof STATUS_KEYS)[number];
