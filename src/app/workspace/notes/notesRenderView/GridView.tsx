import type { DB_NoteType } from "~/server/db/schema"
import NoteCard from "../components/NoteCardComponent"


type GridViewProps = {
  filteredAndSortedNotes: DB_NoteType[];
  selectedNotes: number[];
  setSelectedNote: React.Dispatch<React.SetStateAction<DB_NoteType | null>>;
  deleteNote: (noteId: number) => void;
  toggleNoteStarred: (noteId: number) => void;
  toggleNotePinned: (noteId: number) => void;
  toggleNoteBookmarked: (noteId: number) => void;
}

const GridView = ({
  filteredAndSortedNotes,
  selectedNotes,
  setSelectedNote,
  deleteNote,
  toggleNoteStarred,
  toggleNotePinned,
  toggleNoteBookmarked
}: GridViewProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Pinned notes first */}
      {filteredAndSortedNotes
        .filter((note) => note.isPinned)
        .map((note) => (
          <NoteCard key={`pinned-${note.id}`} note={note} isPinned
            selectedNotes={selectedNotes}
            setSelectedNote={setSelectedNote}
            deleteNote={deleteNote}
            toggleNoteStarred={toggleNoteStarred}
            toggleNotePinned={toggleNotePinned}
            toggleNoteBookmarked={toggleNoteBookmarked}
          />

        ))}
      {/* Regular notes */}
      {filteredAndSortedNotes
        .filter((note) => !note.isPinned)
        .map((note) => (

          <NoteCard
            key={note.id}
            note={note}
            isPinned={note.isPinned}
            selectedNotes={selectedNotes}
            setSelectedNote={setSelectedNote}
            deleteNote={deleteNote}
            toggleNoteStarred={toggleNoteStarred}
            toggleNotePinned={toggleNotePinned}
            toggleNoteBookmarked={toggleNoteBookmarked}
          />
        ))}
    </div>

  )

}


export default GridView

