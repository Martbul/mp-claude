import {
  Share,
  Star,
  Clock,
  Pin,
  Bookmark,
  LinkIcon,
  Brain,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"

import type { DB_NoteType } from "~/server/db/schema"


type NoteCardProps = {
  note: DB_NoteType;
  isPinned?: boolean;
  selectedNotes: number[] | [];
  setSelectedNote: React.Dispatch<React.SetStateAction<DB_NoteType | null>>;
  toggleNoteStarred: (noteId: number) => void;
};



export default function NoteCard({
  note,
  isPinned = false,
  selectedNotes,
  setSelectedNote,
  toggleNoteStarred,
}: NoteCardProps) {
  const noteTagsArray = Array.isArray(note.tags) ? note.tags : [];

  return (
    <Card
      className={`group hover:shadow-lg transition-all cursor-pointer ${selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""
        } ${isPinned ? "border-yellow-200 bg-yellow-50/30" : ""}`}
      style={{ backgroundColor: note.color }}
      onClick={() => setSelectedNote(note)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              {isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
              <h3 className="font-medium text-sm truncate">{note.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {note.category}
              </Badge>
              {note.aiGenerated && (
                <Badge variant="secondary" className="text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1  transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleNoteStarred(note.id)
              }}
            >
              <Star className={`w-4 h-4 ${note.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </Button>

          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-700 line-clamp-3">{note.excerpt}</p>

          <div className="flex flex-wrap gap-1">
            {noteTagsArray.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {noteTagsArray.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{noteTagsArray.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <span>{note.wordCount} words</span>
              <span>{note.readingTime}min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {note.updatedAt.toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {note.isShared && <Share className="w-4 h-4 text-green-600" />}
              {Array.isArray(note.linkedNotes) && note.linkedNotes.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <LinkIcon className="w-3 h-3" />
                  {note.linkedNotes.length}
                </span>
              )}
            </div>
            <Badge
              variant={note.priority === "high" ? "destructive" : note.priority === "medium" ? "default" : "secondary"}
              className="text-xs"
            >
              {note.priority}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

