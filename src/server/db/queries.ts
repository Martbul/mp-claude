import { calendar_events_table, type DB_NoteType, documents_table, files_table, folders_table, notes_table, type DB_FileType, note_folders_table, DB_NoteFolderType, settings_table, document_folders_table } from "~/server/db/schema";
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
    return documents
  },
  getDocumentFolders: async function(userId: string) {
    const documentFolders = await db.select().from(document_folders_table).where(eq(document_folders_table.ownerId, userId))
    return documentFolders
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
  getNotesFolders: async function(userId: string) {
    const notesFolders = await db.select().from(note_folders_table).where(eq(note_folders_table.ownerId, userId))
    return notesFolders
  },

  getUserSettings: async function(userId: string) {
    const userSettings = await db.select().from(settings_table).where(eq(settings_table.userId, userId))
    return userSettings[0]
  },

  getCalendarEvents: async function(userId: string) {
    const calendarEvents = await db.select().from(calendar_events_table).where(eq(calendar_events_table.ownerId, userId))
    return calendarEvents
  }
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
    // Create default settings
    await db.insert(settings_table).values({
      userId,

      // Profile (empty)
      name: null,
      email: null,
      phone: null,
      bio: null,
      institution: null,
      major: null,
      graduationYear: null,
      location: null,
      timezone: null,
      avatar: null,

      // Appearance
      theme: "system",
      accentColor: null,
      fontSize: "medium",
      compactMode: false,
      animations: true,
      sidebarCollapsed: false,
      showAvatars: true,
      colorBlindMode: false,

      // Notifications
      emailNotifications: true,
      pushNotifications: true,
      desktopNotifications: false,
      studyReminders: true,
      deadlineAlerts: true,
      collaborationUpdates: true,
      weeklyDigest: true,
      marketingEmails: false,
      soundEnabled: true,
      vibrationEnabled: true,
      quietHours: null,

      // Privacy
      profileVisibility: "friends",
      showOnlineStatus: true,
      allowDirectMessages: true,
      shareStudyStats: false,
      dataCollection: true,
      analyticsOptIn: true,
      twoFactorAuth: false,
      sessionTimeout: 30,

      // AI
      aiAssistantEnabled: true,
      autoSuggestions: true,
      smartNotifications: true,
      learningAnalytics: true,
      personalizedContent: true,
      voiceInteraction: false,
      creativityLevel: 70,
      responseLength: "medium",
      preferredLanguage: "en",
      contextAwareness: true,

      // Study
      defaultStudyDuration: 25,
      breakDuration: 5,
      longBreakInterval: 4,
      focusMode: true,
      backgroundSounds: false,
      pomodoroEnabled: true,
      goalTracking: true,
      progressSharing: false,
      studyStreaks: true,
      difficultyAdaptation: true,
      spacedRepetition: true,

      createdAt: new Date()
    });


    //create noteFolders
    await db.insert(note_folders_table).values([
      {
        name: "Mathematics",
        color: "#2196F3",
        noteCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "Physics",
        color: "#4CAF50",
        noteCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "Chemistry",
        color: "#FF9800",
        noteCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "History",
        color: "#9C27B0",
        noteCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id (also fixed the variable name)
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "Informatics",
        color: "#00BCD4",
        noteCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id AND fixed variable name (was ownerId)
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "Literature",
        color: "#E91E63",
        noteCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id
        createdAt: new Date(), // Changed from created_at
      },
    ]);



    await db.insert(document_folders_table).values([
      {
        name: "Mathematics",
        color: "#2196F3",
        documentCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "Physics",
        color: "#4CAF50",
        documentCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "Chemistry",
        color: "#FF9800",
        documentCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "History",
        color: "#9C27B0",
        documentCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id (also fixed the variable name)
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "Informatics",
        color: "#00BCD4",
        documentCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id AND fixed variable name (was ownerId)
        createdAt: new Date(), // Changed from created_at
      },
      {
        name: "Literature",
        color: "#E91E63",
        documentCount: 0, // Changed from note_count
        ownerId: userId, // Changed from owner_id
        createdAt: new Date(), // Changed from created_at
      },
    ]);

    //create file root folder
    const rootFolder = await db.insert(folders_table).values({
      name: "Root",
      parent: null,
      ownerId: userId
    }).$returningId();

    return rootFolder;
  },


  createNewNote: async function(data: {
    title: string
    content: string
    category: string
    tags: string[]
    color: string
    priority: "low" | "medium" | "high"
    folderId: number | null
    ownerId: string
  }) {
    const now = new Date()
    const wordCount = data.content.trim().split(/\s+/).length
    await db.insert(notes_table).values({
      title: data.title || "Untitled Note",
      content: data.content,
      excerpt: data.content.slice(0, 150) + "...",
      category: data.category || null,
      tags: data.tags,
      color: data.color,
      priority: data.priority,
      folderId: data.folderId,
      ownerId: data.ownerId,
      createdAt: now,
      updatedAt: now,
      wordCount,
      readingTime: Math.ceil(wordCount / 200),
      isPinned: false,
      isStarred: false,
      isBookmarked: false,
      author: "",
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
    })
  }


}
