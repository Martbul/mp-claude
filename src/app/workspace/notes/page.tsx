import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NotesPage from "./notesPage";
import { QUERIES } from "~/server/db/queries";

export default async function Notes() {

  const user = await auth();
  if (!user.userId) {
    redirect('/sign-in');
  }
  const [notes, notesFolders] = await Promise.all([
    QUERIES.getNotes(user.userId),
    QUERIES.getNotesFolders(user.userId)
  ])

  return (
    <NotesPage notes={notes} notesFolders={notesFolders} userId={user.userId} ></NotesPage>
  );
}

