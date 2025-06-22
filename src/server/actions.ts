"use server"

import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "./db"
import { files_table, note_folders_table, notes_table } from "./db/schema"
import type { DB_NoteType } from "./db/schema"
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { error } from "console"

//when using use server every export becomes an endpoing
//alon with that a function can be used in the client
//


const utApi = new UTApi()

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" }
  }
  const [file] = await db
    .select()
    .from(files_table)
    .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId))) //and want every condition to be true in order to execute the db delete

  if (!file) {
    return { error: "File not found" }
  }

  const utapiResult = await utApi.deleteFiles([file.url.replace("https://utfs.io/f/", "")])

  console.log(utapiResult)
  const dbDeleteResult = await db.delete(files_table).where(eq(files_table.id, fileId))

  const c = await cookies()

  c.set("force-refresh", JSON.stringify(Math.random())) //by updating the cookis next will revalidate the page and update its contents(better way to refresh)

  console.log(dbDeleteResult)
  return { success: true }
}


export async function createNote(noteData: {
  title: string;
  content: string;
  category: string;
  tags: string[];
  color: string;
  priority: "low" | "medium" | "high";
  folder: string | null;
  ownerId: string;
}) {
  try {
    const wordCount = noteData.content.trim().split(/\s+/).length;

    const newNote: Omit<DB_NoteType, 'id'> = {
      title: noteData.title || "Untitled Note",
      ownerId: noteData.ownerId,
      content: noteData.content,
      excerpt: noteData.content.substring(0, 150) + (noteData.content.length > 150 ? "..." : ""),
      category: noteData.category || "Uncategorized",
      tags: noteData.tags,
      color: noteData.color ?? "#ffffff",
      isPinned: false,
      isStarred: false,
      isBookmarked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: "", // Could be pulled from session/user if needed
      wordCount,
      readingTime: Math.ceil(wordCount / 200),
      priority: noteData.priority,
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
      folder: noteData.folder,
    };

    // Insert into DB without .returning() if using MySQL/SingleStore
    const creaatedNote = await db.insert(notes_table).values(newNote);
    // Optionally: query inserted note by last inserted ID if needed
    // This assumes you have access to LAST_INSERT_ID() or similar behavior
    // Otherwise just return success without full note details
    //





    const lastUserNote = await db
      .select()
      .from(notes_table)
      .where(eq(notes_table.ownerId, noteData.ownerId)) // userId: string
      .orderBy(desc(notes_table.createdAt))   // Or use desc(notes_table.id)
      .limit(1)
      .then(rows => rows[0]);

    if (noteData.folder) {
      await db
        .update(note_folders_table)
        .set({
          noteCount: sql`${note_folders_table.noteCount} + 1`,
        })
        .where(
          and(
            eq(note_folders_table.id, noteData.folder),
            eq(note_folders_table.ownerId, noteData.ownerId)
          )
        );
    }

    return {
      success: true,
      data: lastUserNote, // Replace with lookup if you want to return full note
    };
  } catch (error) {
    console.error("Failed to create note:", error);
    return {
      success: false,
      error: "Failed to create note",
    };
  }
}

export async function getNotes(userId: string) {
  try {
    const notes = await db.select().from(notes_table).where(eq(notes_table.ownerId, userId));
    return { success: true, data: notes };
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return { success: false, error: "Failed to fetch notes" };
  }
}



export async function starNoteAction(userId: string, noteId: number) {
  try {
    await db
      .update(notes_table)
      .set({ isStarred: true })
      .where(and(
        eq(notes_table.id, Number(noteId)),
        eq(notes_table.ownerId, userId)
      ));

    const [updatedNote] = await db
      .select()
      .from(notes_table)
      .where(eq(notes_table.id, noteId));

    if (!updatedNote) {
      return { success: false, error: "Note not found after update" };
    }
    return { success: true, data: updatedNote };
  } catch {
    console.error("Failed to star note", error)
    return { success: false, error: "Failed to star note" }
  }
}

export async function unstarNoteAction(userId: string, noteId: number) {
  try {
    await db
      .update(notes_table)
      .set({ isStarred: false })
      .where(and(
        eq(notes_table.id, Number(noteId)),
        eq(notes_table.ownerId, userId)
      ));


    const [updatedNote] = await db
      .select()
      .from(notes_table)
      .where(eq(notes_table.id, noteId));

    if (!updatedNote) {
      return { success: false, error: "Note not found after update" };
    }

    return { success: true, data: updatedNote };
  } catch (error) {
    console.error("Failed to unstar note", error);
    return { success: false, error: "Failed to unstar note" };
  }
}

export async function pinNoteAction(userId: string, noteId: number) {
  try {
    await db
      .update(notes_table)
      .set({ isPinned: true })
      .where(and(
        eq(notes_table.id, Number(noteId)),
        eq(notes_table.ownerId, userId)
      ));

    const [updatedNote] = await db
      .select()
      .from(notes_table)
      .where(eq(notes_table.id, noteId));

    if (!updatedNote) {
      return { success: false, error: "Note not found after update" };
    }



    return { success: true, data: updatedNote };
  } catch (error) {
    console.error("Failed to pin note", error);
    return { success: false, error: "Failed to pin note" };
  }
}

export async function unpinNoteAction(userId: string, noteId: number) {
  try {
    await db
      .update(notes_table)
      .set({ isPinned: false })
      .where(and(
        eq(notes_table.id, Number(noteId)),
        eq(notes_table.ownerId, userId)
      ));

    const [updatedNote] = await db
      .select()
      .from(notes_table)
      .where(eq(notes_table.id, noteId));

    if (!updatedNote) {
      return { success: false, error: "Note not found after update" };
    }


    return { success: true, data: updatedNote };
  } catch (error) {
    console.error("Failed to unpin note", error);
    return { success: false, error: "Failed to unpin note" };
  }
}



export async function deleteNoteAction(userId: string, noteId: number) {
  try {
    await db.delete(notes_table).where(and(
      eq(notes_table.id, Number(noteId)),
      eq(notes_table.ownerId, userId)

    ));

    return { success: true }

  } catch (error) {
    console.log("Failed to delete note", error)
    return { success: false, error: "Filed to delete note" }
  }
}
