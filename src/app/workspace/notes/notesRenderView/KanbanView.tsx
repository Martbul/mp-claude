import { Badge } from "~/components/ui/badge"
import { Card } from "~/components/ui/card"
import { Pin, Star, Brain } from "lucide-react"
import type { DB_NoteType } from "~/server/db/schema"

type KanbanViewProps = {
  filteredAndSortedNotes: DB_NoteType[];
}


const KanbanView = ({ filteredAndSortedNotes }: KanbanViewProps) => {
  const statusColumns = [
    { id: "draft", title: "Draft", notes: filteredAndSortedNotes.filter((n) => n.status === "draft") },
    {
      id: "in-progress",
      title: "In Progress",
      notes: filteredAndSortedNotes.filter((n) => n.status === "in-progress"),
    },
    { id: "completed", title: "Completed", notes: filteredAndSortedNotes.filter((n) => n.status === "completed") },
    { id: "archived", title: "Archived", notes: filteredAndSortedNotes.filter((n) => n.status === "archived") },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statusColumns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="secondary">{column.notes.length}</Badge>
          </div>
          <div className="space-y-3">
            {column.notes.map((note) => (
              <Card key={note.id} className="p-3 hover:shadow-md transition-all cursor-pointer">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm truncate pr-2">{note.title}</h4>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: note.color }} />
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{note.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {note.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {note.isPinned && <Pin className="w-3 h-3 text-gray-600" />}
                      {note.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                      {note.aiGenerated && <Brain className="w-3 h-3 text-purple-600" />}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {note.wordCount} words • {note.readingTime}min read
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default KanbanView

