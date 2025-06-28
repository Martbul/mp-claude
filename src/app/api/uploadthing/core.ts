import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  claudeUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    blob: {
      maxFileSize: "1GB",
      maxFileCount: 999,
    },
  })
    .input(
      z.object({
        folderId: z.number(),
      }),
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const user = await auth();

      // If you throw, the user will not be able to upload

      if (!user.userId) throw new UploadThingError("Unauthorized") as Error;
      const folder = await QUERIES.getFolderById(input.folderId);
      if (!folder) throw new UploadThingError("Folder not found");
      if (folder.ownerId !== user.userId)
        throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, parentId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      await MUTATIONS.createFile({
        file: {
          name: file.name,
          size: file.size,
          url: file.ufsUrl,
          parent: metadata.parentId,
        },
        userId: metadata.userId,
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;






const handleCreateDocumentFolder = async () => {
  const trimmedName = newFolderName.trim();
  if (!trimmedName) return;

  const optimisticFolder: DB_NoteFolderType = {
    id: `${Date.now()}`,
    name: trimmedName,
    color: newFolderColor ?? COLOR_OPTIONS[0],
    noteCount: 0,
    ownerId: props.userId,
  };

  // Optimistically update UI
  setFolders((prev) => [...prev, optimisticFolder]);

  setIsCreateFolderDialogOpen(false);
  try {
    const response = await createFolderAction(optimisticFolder);
    if (!response.success) {
      // Rollback UI update
      setFolders((prev) => prev.filter((f) => f.id !== optimisticFolder.id));
      console.error("Failed to create folder on server:", response.error);
    }
    setIsCreateFolderDialogOpen(false);
  } catch (err) {
    // Rollback on error
    setFolders((prev) => prev.filter((f) => f.id !== optimisticFolder.id));
    console.error("Failed to create folder:", err);
  } finally {
    // Clear input regardless of outcome
    setNewFolderName("");
    setNewFolderColor(COLOR_OPTIONS[0]);
  }
};
//TODO: add editing of a note


const handleDeleteFolder = async (folderId: string) => {
  const prevFolders = folders
  const prevSelectedNotes = selectedNotes;

  setFolders((prev) => prev.filter((f) => f.id !== folderId));
  if (selectedFolder === folderId) setSelectedFolder(null);

  setSelectedNotes((prev) =>
    prev.filter((noteId) => {
      const note = notes.find((n) => n.id === noteId);
      return note?.folder !== folderId;
    })
  );

  // Optional: also remove the notes themselves (optimistically)
  setNotes((prev) => prev.filter((n) => n.folder !== folderId));
  try {
    const result = await deleteFolderAction(props.userId, folderId);

    if (!result.success) {
      // Revert on failure
      setFolders(prevFolders);

      setSelectedNotes(prevSelectedNotes)
      console.error("Failed to delete folder", result.error);
    }


  } catch (error) {
    // Revert on exception
    setFolders(prevFolders);

    setSelectedNotes(prevSelectedNotes)

    console.error("Error deleting folder", error);
  }
}





const deleteNote = async (noteId: number) => {
  // Optimistically update UI
  const prevNotes = notes;
  const prevSelectedNotes = selectedNotes;
  const deletedNote = notes.find(n => n.id === noteId);
  const deletedNoteFolderId = deletedNote?.folder;

  setNotes(prev => prev.filter(note => note.id !== noteId));
  setSelectedNotes(prev => prev.filter(id => id !== noteId));
  setSelectedNote(null);

  // Optimistically decrement folder note count
  if (deletedNoteFolderId) {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === deletedNoteFolderId
          ? { ...folder, noteCount: Math.max((folder.noteCount ?? 1) - 1, 0) }
          : folder
      )
    );
  }

  try {
    const result = await deleteNoteAction(props.userId, noteId);

    if (!result.success) {
      // Revert on failure
      setNotes(prevNotes);
      setSelectedNotes(prevSelectedNotes);

      if (deletedNoteFolderId) {
        setFolders(prev =>
          prev.map(folder =>
            folder.id === deletedNoteFolderId
              ? { ...folder, noteCount: (folder.noteCount ?? 0) + 1 }
              : folder
          )
        );
      }

      console.error("Failed to delete note", result.error);
    }
  } catch (error) {
    // Revert on exception
    setNotes(prevNotes);
    setSelectedNotes(prevSelectedNotes);

    if (deletedNoteFolderId) {
      setFolders(prev =>
        prev.map(folder =>
          folder.id === deletedNoteFolderId
            ? { ...folder, noteCount: (folder.noteCount ?? 0) + 1 }
            : folder
        )
      );
    }

    console.error("Error deleting note", error);
  }
};


const handleDocumentUpload = async () => {


}

const createNote = async () => {
  const wordCount = newNote.content.split(" ").filter(word => word.length > 0).length;

  const optimisticNote: DB_NoteType = {
    id: Date.now(),
    title: newNote.title || "Untitled Note",
    ownerId: props.userId,
    content: newNote.content,
    excerpt: newNote.content.substring(0, 150) + (newNote.content.length > 150 ? "..." : ""),
    category: newNote.category || "Uncategorized",
    tags: newNote.tags,
    color: newNote.color ?? "#ffffff",
    isPinned: false,
    isStarred: false,
    isBookmarked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: "",
    wordCount,
    readingTime: Math.ceil(wordCount / 200),
    priority: newNote.priority ?? "medium",
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
    folder: selectedFolder ?? "",
  };

  const noteDataToSave = {
    title: newNote.title,
    content: newNote.content,
    category: newNote.category,
    tags: newNote.tags,
    color: newNote.color ?? "#ffffff",
    priority: newNote.priority,
    folder: selectedFolder ?? "",
    ownerId: props.userId,
  };

  setNotes(prev => [...prev, optimisticNote]);


  if (selectedFolder) {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === selectedFolder
          ? { ...folder, noteCount: (folder.noteCount ?? 0) + 1 }
          : folder
      )
    );
  }

  setNewNote({
    title: "",
    content: "",
    category: "",
    tags: [],
    color: noteColors[0],
    priority: "medium",
    folder: "",
  });

  setIsCreateNoteDialogOpen(false);

  // Ensure proper return type
  type CreateNoteResult =
    | { success: true; data: DB_NoteType }
    | { success: false; error: string };

  try {
    const result = await createNoteAction(noteDataToSave) as CreateNoteResult;
    console.log(result)
    if (result.success && result.data) {
      setNotes(prev =>
        prev.map(note =>
          note.id === optimisticNote.id ? result.data : note
        )
      );
    } else {
      setNotes(prev => prev.filter(note => note.id !== optimisticNote.id));
      console.error("Failed to create note");
      setNewNote({
        title: noteDataToSave.title,
        content: noteDataToSave.content,
        category: noteDataToSave.category,
        tags: noteDataToSave.tags,
        color: noteDataToSave.color,
        priority: noteDataToSave.priority,
        folder: noteDataToSave.folder,
      });


      // Roll back folder count
      if (selectedFolder) {
        setFolders(prev =>
          prev.map(folder =>
            folder.id === selectedFolder
              ? { ...folder, noteCount: Math.max((folder.noteCount ?? 1) - 1, 0) }
              : folder
          )
        );
      }

      setIsCreateNoteDialogOpen(true);
    }
  } catch (error) {
    setNotes(prev => prev.filter(note => note.id !== optimisticNote.id));
    console.error("Failed to create note:", error);
    setNewNote({
      title: noteDataToSave.title,
      content: noteDataToSave.content,
      category: noteDataToSave.category,
      tags: noteDataToSave.tags,
      color: noteDataToSave.color,
      priority: noteDataToSave.priority,
      folder: noteDataToSave.folder,
    });
    setIsCreateNoteDialogOpen(true);
  }
};


