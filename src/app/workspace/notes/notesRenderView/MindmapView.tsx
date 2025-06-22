import {
  Star,
  Pin,
  LinkIcon,
} from "lucide-react"
import { Card } from "~/components/ui/card"
import { type DB_NoteType } from "~/server/db/schema";


type MindmapViewProps = {
  filteredAndSortedNotes: DB_NoteType[];
  categories: (string | null)[];
  noteColors: string[];
}

const MindmapView = ({
  filteredAndSortedNotes,
  categories,
  noteColors,
}: MindmapViewProps) => {


  // Group notes by category for mind map visualization
  const categoryGroups = categories.map((category) => ({
    category,
    notes: filteredAndSortedNotes.filter((note) => note.category === category),
    color: noteColors[categories.indexOf(category) % noteColors.length],
  }))

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-lg font-bold">
          My Notes
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryGroups.map((group) => (
          <div key={group.category} className="space-y-4">
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full text-white font-semibold"
                style={{ backgroundColor: group.color }}
              >
                {group.category}
              </div>
              <div className="mt-2 text-sm text-gray-600">{group.notes.length} notes</div>
            </div>

            <div className="space-y-2">
              {group.notes.slice(0, 5).map((note) => {
                const linkedNotesArray = Array.isArray(note.linkedNotes) ? note.linkedNotes : []
                return (
                  <Card key={note.id} className="p-3 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: note.color }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{note.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{note.wordCount} words</span>
                          {linkedNotesArray.length > 0 && (
                            <span className="flex items-center gap-1">
                              <LinkIcon className="w-3 h-3" />
                              {linkedNotesArray.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {note.isPinned && <Pin className="w-3 h-3 text-gray-600" />}
                        {note.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                      </div>
                    </div>
                  </Card>
                )
              })}
              {group.notes.length > 5 && (
                <div className="text-center text-sm text-gray-500">+{group.notes.length - 5} more notes</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export default MindmapView
