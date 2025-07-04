"use server"

import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "./db"
import { calendar_events_table, document_folders_table, documents_table, files_table, note_folders_table, notes_table } from "./db/schema"
import type { DB_CalendarrType, DB_DocumentType, DB_NoteType } from "./db/schema"
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { error } from "console"

//when using use server every export becomes an endpoing
//alon with that a function can be used in the client


const utApi = new UTApi()

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" }
  }
  const [file] = await db
    .select()
    .from(files_table)
    .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)))

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
  folderId: number | null;
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
      author: "",
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
      folderId: noteData.folderId,
    };

    await db.insert(notes_table).values(newNote);

    const lastUserNote = await db
      .select()
      .from(notes_table)
      .where(eq(notes_table.ownerId, noteData.ownerId))
      .orderBy(desc(notes_table.createdAt))
      .limit(1)
      .then(rows => rows[0]);

    if (noteData.folderId) {
      await db
        .update(note_folders_table)
        .set({
          noteCount: sql`${note_folders_table.noteCount} + 1`,
        })
        .where(
          and(
            eq(note_folders_table.id, noteData.folderId),
            eq(note_folders_table.ownerId, noteData.ownerId)
          )
        );
    }

    return {
      success: true,
      data: lastUserNote,
    };
  } catch (error) {
    console.error("Failed to create note:", error);
    return {
      success: false,
      error: "Failed to create note",
    };
  }
}



export async function createDocumentAction(documentData: {
  name: string;
  type: string;
  size: number;
  url: string;
  description: string;
  tags: string[];
  category: string;
  isStarred: boolean,
  isShared: boolean,
  isLocked: boolean,
  difficulty: string,
  subject: string,
  folderId: number | null;
  ownerId: string;
}) {
  console.log(documentData)
  try {

    const newDocument: Omit<DB_DocumentType, 'id'> = {
      name: documentData.name || "Untitled Document",
      type: documentData.type,
      size: documentData.size,
      ownerId: documentData.ownerId,
      url: documentData.url || "",
      dateCreated: new Date(),
      dateModified: new Date(),
      tags: documentData.tags || [],
      category: documentData.category || "Uncategorized",
      isStarred: documentData.isStarred,
      isShared: documentData.isShared,
      isLocked: documentData.isLocked,
      thumbnail: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fdoc&psig=AOvVaw03MgAeyN8YUUp8me6WJclf&ust=1751385819668000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCP-eLCmY4DFQAAAAAdAAAAABAX",
      description: documentData.description,
      version: 1,
      downloadCount: 0,
      viewCount: 0,
      aiProcessed: false,
      aiSummary: null,
      aiTags: [],
      collaborators: [],
      parentFolder: "FAKEFOLDER",
      path: "FAKEPATH",
      status: "synced",
      aiScore: null,
      readingTime: null,
      difficulty: documentData.difficulty,
      subject: documentData.subject,
      folderId: documentData.folderId,
    };
    console.log(newDocument)
    await db.insert(documents_table).values(newDocument);

    const lastUserDocument = await db
      .select()
      .from(documents_table)
      .where(eq(documents_table.ownerId, documentData.ownerId))
      .orderBy(desc(documents_table.dateCreated))
      .limit(1)
      .then(rows => rows[0]);

    if (documentData.folderId) {
      await db
        .update(document_folders_table)
        .set({
          documentCount: sql`${document_folders_table.documentCount} + 1`,
        })
        .where(
          and(
            eq(document_folders_table.id, documentData.folderId),
            eq(document_folders_table.ownerId, documentData.ownerId)
          )
        );
    }

    return {
      success: true,
      data: lastUserDocument,
    };
  } catch (error) {
    console.error("Failed to create document:", error);
    return {
      success: false,
      error: "Failed to create document",
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



export async function deleteDocumentAction(userId: string, documentId: number) {
  try {

    const [documentForDeletion] = await db
      .select()
      .from(documents_table)
      .where(eq(documents_table.id, documentId));

    if (documentForDeletion?.folderId) {
      await db
        .update(document_folders_table)
        .set({
          documentCount: sql`${document_folders_table.documentCount} - 1`,
        })
        .where(
          and(
            eq(document_folders_table.id, documentForDeletion.folderId),
            eq(document_folders_table.ownerId, documentForDeletion.ownerId)
          )
        );
    }


    await db.delete(documents_table).where(and(
      eq(documents_table.id, Number(documentId)),
      eq(documents_table.ownerId, userId)
    ));

    return { success: true }

  } catch (error) {
    console.log("Failed to delete document", error)
    return { success: false, error: "Filed to delete document" }
  }
}


export async function deleteNoteAction(userId: string, noteId: number) {
  try {

    const [noteForDeletion] = await db
      .select()
      .from(notes_table)
      .where(eq(notes_table.id, noteId));

    if (noteForDeletion?.folderId) {
      await db
        .update(note_folders_table)
        .set({
          noteCount: sql`${note_folders_table.noteCount} - 1`,
        })
        .where(
          and(
            eq(note_folders_table.id, noteForDeletion.folderId),
            eq(note_folders_table.ownerId, noteForDeletion.ownerId)
          )
        );
    }


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



export async function createFolderAction(folder: {
  id: number;
  name: string;
  color: string;
  noteCount: number;
  ownerId: string;
}) {
  try {
    await db.insert(note_folders_table).values({
      id: folder.id,
      name: folder.name,
      color: folder.color,
      noteCount: folder.noteCount,
      ownerId: folder.ownerId,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create folder", error);
    return { success: false, error: "Failed to create folder" };
  }
}


export async function createDocumentFolderAction(folder: {
  id: number;
  name: string;
  color: string;
  documentCount: number;
  ownerId: string;
}) {
  try {
    await db.insert(document_folders_table).values({
      id: folder.id,
      name: folder.name,
      color: folder.color,
      documentCount: folder.documentCount,
      ownerId: folder.ownerId,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create folder", error);
    return { success: false, error: "Failed to create folder" };
  }
}

export async function deleteFolderAction(userId: string, folderId: number) {
  try {

    await db.delete(note_folders_table).where(and(eq(note_folders_table.id, folderId), eq(note_folders_table.ownerId, userId)))

    await db.delete(notes_table).where(and(eq(notes_table.folderId, folderId), eq(notes_table.ownerId, userId)))

    return { success: true }
  }
  catch (error) {
    console.log("Filed to delete note", error)
    return { success: false, error: "Filed to delete note" }
  }
}


export async function deleteDocumentFolderAction(userId: string, folderId: number) {
  console.log(folderId)
  try {

    await db.delete(document_folders_table).where(and(eq(document_folders_table.id, folderId), eq(document_folders_table.ownerId, userId)))

    await db.delete(documents_table).where(and(eq(documents_table.folderId, folderId), eq(documents_table.ownerId, userId)))

    return { success: true }
  }
  catch (error) {
    console.log("Filed to delete note", error)
    return { success: false, error: "Filed to delete note" }
  }
}




export async function createCalendarEventAction(userId: string, eventData: {
  title: string;
  description: string | null;
  date: string;
  startTime: string | null;
  endTime: string | null;
  type: string;
  priority: "low" | "medium" | "high";
  location: string | null;
  fileLinks: string[];
  recurring: string;
  reminderMinutes: number | null;
  completed?: boolean;
  ownerId: string;
}) {
  try {
    const newEvent: DB_CalendarrType = {
      id: Date.now(),
      ownerId: eventData.ownerId,
      title: eventData.title || "Untitled Event",
      description: eventData.description ?? null,
      date: eventData.date,
      startTime: eventData.startTime ?? null,
      endTime: eventData.endTime ?? null,
      type: eventData.type || "other",
      priority: eventData.priority ?? "medium",
      location: eventData.location ?? null,
      fileLinks: eventData.fileLinks ?? [],
      recurring: eventData.recurring ?? "none",
      reminderMinutes: eventData.reminderMinutes ?? null,
      completed: eventData.completed ?? false,
      createdAt: new Date(),
    };

    await db.insert(calendar_events_table).values(newEvent);

    const latestEvent = await db
      .select()
      .from(calendar_events_table)
      .where(eq(calendar_events_table.ownerId, eventData.ownerId))
      .orderBy(desc(calendar_events_table.createdAt))
      .limit(1)
      .then(rows => rows[0]);

    return {
      success: true,
      data: latestEvent
    };
  } catch (error) {
    console.error("Failed to create calendar event:", error);
    return {
      success: false,
      error: "Failed to create calendar event",
    };
  }
}


export async function deleteCalendarEventAction(userId: string, eventId: number) {
  try {

    await db.delete(calendar_events_table).where(and(eq(calendar_events_table.id, eventId), eq(calendar_events_table.ownerId, userId)))
    return { success: true }
  }
  catch (error) {
    console.log("Filed to delete note", error)
    return { success: false, error: "Filed to delete note" }

  }

}

export async function toggleCalendarEventCompletionAction(userId: string, eventId: number, newCompleted: boolean) {
  try {

    await db
      .update(calendar_events_table)
      .set({ completed: newCompleted })
      .where(and(
        eq(calendar_events_table.id, Number(eventId)),
        eq(calendar_events_table.ownerId, userId)
      ));

    const [updatedCalendarEvent] = await db
      .select()
      .from(calendar_events_table)
      .where(eq(calendar_events_table.id, eventId));

    if (!updatedCalendarEvent) {
      return { success: false, error: "Caledar event not found after update" };
    }


    return { success: true, data: updatedCalendarEvent };

  } catch (error) {
    console.log("Failed to toggleCalendar completed event")
    return { success: false, error: "Failed to toggle completetion of calendar event" }
  }

}
