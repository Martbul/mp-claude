import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NotesPage from "./notesPage";
import { QUERIES } from "~/server/db/queries";

export default async function Notes() {

  const user = await auth();
  if (!user) {
    redirect('/sign-in');
  }


  const notes = await QUERIES.getNotes(user.userId!)
  console.log(notes)


  return (
    <NotesPage notes={notes} userId={user.userId!}></NotesPage>
  );
}

