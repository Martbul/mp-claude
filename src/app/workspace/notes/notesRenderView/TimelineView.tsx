import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { type DB_NoteType } from "~/server/db/schema";


type TimelineViewProps = {
  filteredAndSortedNotes: DB_NoteType[];
}

const TimelineView = ({
  filteredAndSortedNotes,
}: TimelineViewProps) => {



  const groupedByDate = filteredAndSortedNotes.reduce(
    (acc, note) => {
      const date = note.updatedAt.toDateString()
      acc[date] ??= []
      acc[date].push(note)
      return acc
    },
    {} as Record<string, DB_NoteType[]>,
  )

  return (
    <div className="space-y-8">
      {Object.entries(groupedByDate).map(([date, dayNotes]) => (
        <div key={date} className="relative">
          <div className="sticky top-0 bg-white z-10 py-2 border-b">
            <h3 className="font-semibold text-lg">{date}</h3>
          </div>
          <div className="mt-4 space-y-4 relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            {dayNotes.map((note) => (
              <div key={note.id} className="relative flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: note.color }} />
                </div>
                <Card className="flex-1 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{note.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {note.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {note.updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{note.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{note.wordCount} words</span>
                        <span>{note.readingTime}min read</span>
                        <span>v{note.version}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TimelineView 
