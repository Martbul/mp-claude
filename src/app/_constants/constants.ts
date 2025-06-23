import { type NoteTemplate } from "../_types/types"

export const eventTypeColors = {
	exam: "bg-red-100 text-red-800 border-red-200",
	assignment: "bg-blue-100 text-blue-800 border-blue-200",
	reminder: "bg-yellow-100 text-yellow-800 border-yellow-200",
	study: "bg-green-100 text-green-800 border-green-200",
	meeting: "bg-purple-100 text-purple-800 border-purple-200",
	other: "bg-gray-100 text-gray-800 border-gray-200",
}

export const priorityColors = {
	low: "border-l-gray-400",
	medium: "border-l-yellow-400",
	high: "border-l-red-400",
}






export const noteColors = [
	"#FFE4E1",
	"#E1F5FE",
	"#E8F5E8",
	"#FFF3E0",
	"#F3E5F5",
	"#E0F2F1",
	"#FFF8E1",
	"#FCE4EC",
	"#E3F2FD",
	"#F1F8E9",
]

export const noteTemplates: NoteTemplate[] = [
	{
		id: "lecture",
		name: "Lecture Notes",
		description: "Template for taking lecture notes",
		content:
			"# Lecture: [Topic]\n\n**Date:** \n**Professor:** \n\n## Key Points\n\n## Details\n\n## Questions\n\n## Action Items",
		category: "Academic",
		icon: "📚",
	},
	{
		id: "meeting",
		name: "Meeting Notes",
		description: "Template for meeting notes",
		content:
			"# Meeting: [Title]\n\n**Date:** \n**Attendees:** \n\n## Agenda\n\n## Discussion Points\n\n## Decisions Made\n\n## Next Steps",
		category: "Professional",
		icon: "🤝",
	},
	{
		id: "research",
		name: "Research Notes",
		description: "Template for research documentation",
		content:
			"# Research: [Topic]\n\n**Research Question:** \n**Hypothesis:** \n\n## Literature Review\n\n## Methodology\n\n## Findings\n\n## Conclusions",
		category: "Academic",
		icon: "🔬",
	},
	{
		id: "study-guide",
		name: "Study Guide",
		description: "Template for exam preparation",
		content:
			"# Study Guide: [Subject]\n\n**Exam Date:** \n**Format:** \n\n## Key Concepts\n\n## Formulas\n\n## Practice Problems\n\n## Review Schedule",
		category: "Academic",
		icon: "📖",
	},
]

export const COLOR_OPTIONS = [
	"#E57373", "#64B5F6", "#81C784", "#FFD54F", "#BA68C8", "#4DB6AC", "#FF8A65",
]
