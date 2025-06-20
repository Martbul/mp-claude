import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NotesPage from "./notesPage";
import { MUTATIONS, QUERIES } from "~/server/db/queries";
import { DB_NoteType } from "~/server/db/schema";
import { Button } from "~/components/ui/button";

export async function CreateNotesButton(props: { newNote: any, userId: string }) {


  // Create new note
  const createNote = async () => {
    const note: DB_NoteType = {
      id: Date.now(), // Temporary ID - in real app, this would be handled by the database
      title: props.newNote.title || "Untitled Note",
      ownerId: props.userId,
      content: props.newNote.content,
      excerpt: props.newNote.content.substring(0, 150) + "...",
      category: props.newNote.category || "Uncategorized",
      tags: props.newNote.tags,
      color: props.newNote.color || "#ffffff",
      isPinned: false,
      isStarred: false,
      isBookmarked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: "",
      wordCount: props.newNote.content.split(" ").length,
      readingTime: Math.ceil(props.newNote.content.split(" ").length / 200),
      priority: props.newNote.priority,
      status: "draft",
      template: null,
      linkedNotes: [],
      attachments: [],
      collaborators: [],
      aiGenerated: false,
      aiSummary: null,
      version: 1,
      isShared: false,
      viewCount: 0,
      folder: props.newNote.folder || null,
    }

    await MUTATIONS.createNewNote(note)
  }



  return (
    <Button onClick={createNote}>Create Note</Button>
  );
}


export default async function Notes() {

  const user = await auth();
  if (!user) {
    redirect('/sign-in');
  }


  const notes = await QUERIES.getNotes(user.userId!)
  console.log(notes)


  return (
    <NotesPage notes={notes} userId={user.userId!} CreateNoteButton={<CreateNotesButton />}></NotesPage>
  );
}

