//calendar
export type CalendarViewMode = "month" | "week" | "day"


//notes
export interface NoteTemplate {
	id: string
	name: string
	description: string
	content: string
	category: string
	icon: string
}

export type NotesViewMode = "grid" | "list" | "kanban" | "timeline" | "mindmap"
export type SortBy = "updated" | "created" | "title" | "category" | "wordcount"


export type DocumentViewMode = "grid" | "list" | "timeline" | "kanban"
export type DocumentSortBy = "name" | "date" | "size" | "type" | "views" | "ai-score"


