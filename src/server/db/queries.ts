import "server-only";

import { calendar_events_table, DB_NoteType, documents_table, files_table, folders_table, notes_table, type DB_FileType } from "~/server/db/schema";
import { db } from "~/server/db";
import { and, desc, eq, isNull } from "drizzle-orm";

export const QUERIES = {
  //you dont have to async/await if you are returning a promise
  getFolders: function(folderId: number) {
    return db.select().from(folders_table).where(eq(folders_table.parent, folderId)).orderBy(folders_table.id)
  },


  getFiles: function(folderId: number) {
    return db.select().from(files_table).where(eq(files_table.parent, folderId)).orderBy(files_table.id)
  },

  getAllParentsForFolder: async function(folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(folders_table)
        .where(eq(folders_table.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },
  getFolderById: async function(folderId: number) {
    const folder = await db.select().from(folders_table).where(eq(folders_table.id, folderId));
    return folder[0]
  },
  getRootFolderForUser: async function(userId: string) {
    const folder = await db.select().from(folders_table).where(and(eq(folders_table.ownerId, userId), isNull(folders_table.parent)))
    return folder[0]
  },


  getDocuments: async function(userId: string) {
    const documents = await db.select().from(documents_table).where(eq(documents_table.ownerId, userId))
    return documents[0]
  },
  getMax5Documents: async function(userId: string) {
    const documents = await db
      .select()
      .from(documents_table)
      .where(eq(documents_table.ownerId, userId))
      .orderBy(desc(documents_table.dateCreated))
      .limit(5);

    return documents;
  },

  getCalEvents: async function(userId: string) {
    const calEvents = await db.select().from(calendar_events_table).where(eq(calendar_events_table.ownerId, userId))
    return calEvents[0]
  },


  getNotes: async function(userId: string) {
    const notes = await db.select().from(notes_table).where(eq(notes_table.ownerId, userId))
    return notes
  },



}


export const MUTATIONS = {
  createFile: async function(input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db.insert(files_table).values({ ...input.file, ownerId: input.userId })

  },

  onboardUser: async function(userId: string) {
    const rootFolder = await db.insert(folders_table).values({
      name: "Root",
      parent: null,
      ownerId: userId
    }).$returningId();

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(folders_table).values([{
      name: "Trash",
      parent: rootFolderId,
      ownerId: userId,
    },
    {
      name: "Shared",
      parent: rootFolderId,
      ownerId: userId,
    },
    {
      name: "Documents",
      parent: rootFolderId,
      ownerId: userId,
    },
    {
      name: "Images",
      parent: rootFolderId,
      ownerId: userId,
    }
    ])

    return rootFolder;
  },

  createNewNote: async function(noteData: DB_NoteType) {
    await db.insert(notes_table).values(noteData)
  },


}
