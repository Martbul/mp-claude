import { DB_DocumentType } from "~/server/db/documents"


export const formatFileSize = (bytes: number) => {
	if (bytes === 0) return "0 Bytes"
	const k = 1024
	const sizes = ["Bytes", "KB", "MB", "GB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const getFileType = (filename: string): DB_DocumentType["type"] => {
	const ext = filename.split(".").pop()?.toLowerCase()
	switch (ext) {
		case "pdf":
			return "pdf"
		case "doc":
		case "docx":
			return "docx"
		case "ppt":
		case "pptx":
			return "pptx"
		case "xls":
		case "xlsx":
			return "xlsx"
		case "txt":
			return "txt"
		case "jpg":
		case "jpeg":
		case "png":
		case "gif":
			return "image"
		case "mp4":
		case "avi":
		case "mov":
			return "video"
		case "mp3":
		case "wav":
			return "audio"
		case "js":
		case "ts":
		case "py":
		case "java":
			return "code"
		default:
			return "other"
	}
}
