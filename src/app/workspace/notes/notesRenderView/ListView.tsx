import {
  Star,
  Eye,
  Edit,
  Trash2,
  Copy,
  Pin,
  Bookmark,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { DB_NoteType } from "~/server/db/schema"



type ListViewProps = {
  filteredAndSortedNotes: DB_NoteType[];
  selectedNotes: number[];
  setSelectedNote: React.Dispatch<React.SetStateAction<DB_NoteType | null>>;
  deleteNote: (noteId: number) => void;
  toggleNoteSelection: (noteId: number) => void;
}

const ListView = ({
  filteredAndSortedNotes,
  selectedNotes,
  setSelectedNote,
  deleteNote,
  toggleNoteSelection
}: ListViewProps) => {



  return (


    <div className="space-y-2">
      {filteredAndSortedNotes.map((note) => (
        <Card
          key={note.id}
          className={`hover:shadow-md transition-all cursor-pointer ${selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""
            }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedNotes.includes(note.id)}
                onCheckedChange={() => toggleNoteSelection(note.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: note.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  {note.isPinned && <Pin className="w-4 h-4 text-gray-600" />}
                  {note.isStarred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                  {note.isBookmarked && <Bookmark className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-sm text-gray-600 truncate">{note.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span>{note.category}</span>
                  <span>{note.wordCount} words</span>
                  <span>{note.updatedAt.toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {note.viewCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {note.priority}
                </Badge>
                <Badge variant={note.status === "completed" ? "default" : "secondary"} className="text-xs">
                  {note.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedNote(note)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteNote(note.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

  )

}
export default ListView

