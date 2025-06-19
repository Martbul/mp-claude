export interface File {
  id: string;
  name: string;
  type: "file";
  url: string;
  parent: string;
  size: string;
}

export type Folder = {
  id: string;
  name: string;
  type: "folder";
  parent: string | null;
};


export const mockFolders: Folder[] = [
  { id: "root", name: "root", type: "folder", parent: null },
  { id: "1", name: "Documents", type: "folder", parent: "root" },
  { id: "2", name: "Images", type: "folder", parent: "root" },
  { id: "3", name: "Work", type: "folder", parent: "root" },
  { id: "4", name: "Presentations", type: "folder", parent: "3" },
];




export const mockFiles: File[] = [
  {
    id: "4",
    name: "Resume.pdf",
    type: "file",
    url: "/files/resume.pdf",
    parent: "root",
    size: "1.2 MB",
  },
  {
    id: "5",
    name: "Project Proposal.docx",
    type: "file",
    url: "/files/proposal.docx",
    parent: "1",
    size: "2.5 MB",
  },
  {
    id: "6",
    name: "Vacation.jpg",
    type: "file",
    url: "/files/vacation.jpg",
    parent: "2",
    size: "3.7 MB",
  },
  {
    id: "7",
    name: "Profile Picture.png",
    type: "file",
    url: "/files/profile.png",
    parent: "2",
    size: "1.8 MB",
  },
  {
    id: "9",
    name: "Q4 Report.pptx",
    type: "file",
    url: "/files/q4-report.pptx",
    parent: "8",
    size: "5.2 MB",
  },
  {
    id: "10",
    name: "Budget.xlsx",
    type: "file",
    url: "/files/budget.xlsx",
    parent: "3",
    size: "1.5 MB",
  },
];



export const mockNotes = [
  {
    id: 1,
    ownerId: "user_01",
    title: "Meeting Notes",
    content: "Discussed quarterly goals and project milestones.",
    excerpt: "Quarterly goals and milestones covered.",
    category: "Work",
    tags: ["meeting", "q1", "milestones"],
    color: "blue",
    isPinned: true,
    isStarred: true,
    isBookmarked: false,
    createdAt: new Date("2025-05-01T10:00:00Z"),
    updatedAt: new Date("2025-05-01T12:00:00Z"),
    author: "John Doe",
    wordCount: 250,
    readingTime: 2,
    priority: "high",
    status: "completed",
    template: "meeting",
    linkedNotes: [2, 3],
    attachments: [],
    collaborators: ["user_02"],
    aiGenerated: false,
    aiSummary: "Covers project goals and timeline.",
    version: 1,
    isShared: true,
    viewCount: 25,
    folder: "Projects/2025"
  },
  {
    id: 2,
    ownerId: "user_01",
    title: "Product Launch Plan",
    content: "Step-by-step plan for the new product launch.",
    excerpt: "Timeline and tasks for product launch.",
    category: "Planning",
    tags: ["launch", "product", "timeline"],
    color: "green",
    isPinned: false,
    isStarred: true,
    isBookmarked: true,
    createdAt: new Date("2025-04-15T09:00:00Z"),
    updatedAt: new Date("2025-04-16T11:30:00Z"),
    author: "John Doe",
    wordCount: 1200,
    readingTime: 8,
    priority: "high",
    status: "in-progress",
    template: "project-plan",
    linkedNotes: [1],
    attachments: ["launch_checklist.pdf"],
    collaborators: ["user_03"],
    aiGenerated: true,
    aiSummary: "Launch strategy with tasks and resources.",
    version: 2,
    isShared: true,
    viewCount: 80,
    folder: "Marketing/Launches"
  },
  {
    id: 3,
    ownerId: "user_01",
    title: "Personal Reflection",
    content: "Reflecting on the challenges and growth over the past month.",
    excerpt: "Monthly reflections and self-assessment.",
    category: "Personal",
    tags: ["reflection", "journal", "growth"],
    color: "purple",
    isPinned: false,
    isStarred: false,
    isBookmarked: true,
    createdAt: new Date("2025-06-01T20:00:00Z"),
    updatedAt: new Date("2025-06-01T20:00:00Z"),
    author: "John Doe",
    wordCount: 800,
    readingTime: 5,
    priority: "medium",
    status: "completed",
    template: "journal",
    linkedNotes: [],
    attachments: [],
    collaborators: [],
    aiGenerated: false,
    aiSummary: "Insights and emotions from last month.",
    version: 1,
    isShared: false,
    viewCount: 10,
    folder: "Personal/Journal"
  },
  // Add 17 more mock notes with variety
  ...Array.from({ length: 17 }, (_, i) => ({
    id: i + 4,
    ownerId: `user_${(i % 3) + 1}`,
    title: `Note ${i + 4}`,
    content: `This is the content of note ${i + 4}. It discusses various topics.`,
    excerpt: `Brief overview of note ${i + 4}.`,
    category: ["Work", "Personal", "Ideas", "Archive"][i % 4],
    tags: [`tag${i + 1}`, `tag${(i + 2) % 10}`],
    color: ["red", "blue", "green", "yellow", "orange"][i % 5],
    isPinned: i % 5 === 0,
    isStarred: i % 4 === 0,
    isBookmarked: i % 3 === 0,
    createdAt: new Date(2025, 4 + (i % 2), 10 + (i % 20)),
    updatedAt: new Date(2025, 4 + (i % 2), 11 + (i % 20)),
    author: `User ${(i % 3) + 1}`,
    wordCount: 500 + i * 20,
    readingTime: 3 + (i % 5),
    priority: ["low", "medium", "high"][i % 3],
    status: ["draft", "in-progress", "completed", "archived"][i % 4],
    template: null,
    linkedNotes: [1, 2].slice(0, (i % 2) + 1),
    attachments: [],
    collaborators: [],
    aiGenerated: i % 2 === 0,
    aiSummary: i % 2 === 0 ? `AI summary for note ${i + 4}` : null,
    version: 1,
    isShared: i % 2 === 0,
    viewCount: i * 10,
    folder: ["Projects", "Ideas", "Archive"][i % 3]
  }))
]


export const mockCalendarEvents = [
  {
    id: 1,
    ownerId: "user_01",
    title: "Team Sync",
    description: "Weekly team sync-up on project status.",
    date: "2025-06-19",
    startTime: "10:00",
    endTime: "11:00",
    type: "meeting",
    priority: "medium",
    location: "Zoom",
    fileLinks: ["https://link.to/agenda"],
    recurring: "weekly",
    reminderMinutes: 15,
    completed: false,
    createdAt: new Date("2025-06-10T09:00:00Z")
  },
  {
    id: 2,
    ownerId: "user_01",
    title: "Doctor Appointment",
    description: "Annual health checkup.",
    date: "2025-06-20",
    startTime: "14:00",
    endTime: "15:00",
    type: "personal",
    priority: "high",
    location: "City Clinic",
    fileLinks: [],
    recurring: "yearly",
    reminderMinutes: 60,
    completed: false,
    createdAt: new Date("2025-06-12T13:00:00Z")
  },
  {
    id: 3,
    ownerId: "user_02",
    title: "Marketing Review",
    description: "Review the latest marketing campaign performance.",
    date: "2025-06-21",
    startTime: "09:00",
    endTime: "10:30",
    type: "work",
    priority: "high",
    location: "Office Room 3A",
    fileLinks: ["https://link.to/report.pdf"],
    recurring: "none",
    reminderMinutes: 30,
    completed: false,
    createdAt: new Date("2025-06-13T08:00:00Z")
  },
  {
    id: 4,
    ownerId: "user_01",
    title: "Yoga Class",
    description: "Weekly yoga session for relaxation.",
    date: "2025-06-22",
    startTime: "18:00",
    endTime: "19:00",
    type: "personal",
    priority: "low",
    location: "Community Center",
    fileLinks: [],
    recurring: "weekly",
    reminderMinutes: 10,
    completed: false,
    createdAt: new Date("2025-06-14T07:30:00Z")
  },
  {
    id: 5,
    ownerId: "user_03",
    title: "Client Call",
    description: "Quarterly check-in with ACME Corp.",
    date: "2025-06-24",
    startTime: "16:00",
    endTime: "17:00",
    type: "call",
    priority: "medium",
    location: "Google Meet",
    fileLinks: [],
    recurring: "quarterly",
    reminderMinutes: 20,
    completed: false,
    createdAt: new Date("2025-06-15T11:45:00Z")
  },
  // Generate 15 more
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 6,
    ownerId: `user_${(i % 3) + 1}`,
    title: `Event ${i + 6}`,
    description: `Description for event ${i + 6}.`,
    date: new Date(2025, 5, 25 + i).toISOString().split("T")[0], // From June 25 onward
    startTime: `${9 + (i % 5)}:00`,
    endTime: `${10 + (i % 5)}:00`,
    type: ["meeting", "work", "personal", "call", "deadline"][i % 5],
    priority: ["low", "medium", "high"][i % 3],
    location: ["Zoom", "Office", "Online", "Cafe", "Library"][i % 5],
    fileLinks: i % 2 === 0 ? [`https://link.to/resource${i + 6}`] : [],
    recurring: ["none", "weekly", "monthly", "yearly"][i % 4],
    reminderMinutes: (i % 4) * 10,
    completed: i % 3 === 0,
    createdAt: new Date(2025, 5, 15 + (i % 5), 8 + (i % 4), 0, 0)
  }))
];





export const mockDocuments = [
  {
    id: "1729384728000",
    name: "Quarterly_Report_Q2",
    type: "pdf",
    size: 254000,
    dateCreated: new Date("2025-06-10T09:00:00Z"),
    dateModified: new Date("2025-06-18T11:00:00Z"),
    tags: ["report", "finance", "q2"],
    category: "Reports",
    isStarred: true,
    isShared: true,
    isLocked: false,
    thumbnail: "https://cdn.example.com/thumbnails/q2report.png",
    description: "Q2 performance overview and financial analysis.",
    author: "John Doe",
    version: 2,
    downloadCount: 130,
    viewCount: 340,
    aiProcessed: true,
    aiSummary: "Summary: Sales growth, expense analysis, projections.",
    aiTags: ["sales", "growth", "forecast"],
    collaborators: ["user_02", "user_03"],
    parentFolder: "finance/2025",
    path: "/finance/2025/Quarterly_Report_Q2.pdf",
    status: "synced",
    aiScore: 0.92,
    readingTime: 6,
    difficulty: "intermediate",
    subject: "Finance"
  },
  {
    id: "1729384728001",
    name: "Product_Brief_Apollo",
    type: "docx",
    size: 87000,
    dateCreated: new Date("2025-06-11T14:00:00Z"),
    dateModified: new Date("2025-06-11T15:00:00Z"),
    tags: ["product", "brief", "launch"],
    category: "Planning",
    isStarred: false,
    isShared: false,
    isLocked: false,
    thumbnail: "",
    description: "One-pager on the Apollo launch roadmap.",
    author: "Jane Smith",
    version: 1,
    downloadCount: 40,
    viewCount: 75,
    aiProcessed: true,
    aiSummary: "Covers timeline, goals, KPIs of Apollo launch.",
    aiTags: ["product", "timeline", "milestones"],
    collaborators: ["user_04"],
    parentFolder: "projects/apollo",
    path: "/projects/apollo/Product_Brief_Apollo.docx",
    status: "synced",
    aiScore: 0.85,
    readingTime: 2,
    difficulty: "beginner",
    subject: "Product Management"
  },
  {
    id: "1729384728002",
    name: "2025_Strategy_Deck",
    type: "pdf",
    size: 510000,
    dateCreated: new Date("2025-06-13T10:00:00Z"),
    dateModified: new Date("2025-06-14T11:00:00Z"),
    tags: ["strategy", "slides", "2025"],
    category: "Strategy",
    isStarred: true,
    isShared: true,
    isLocked: true,
    thumbnail: "https://cdn.example.com/thumbnails/strategydeck.png",
    description: "Slide deck for 2025 strategic vision.",
    author: "Sam Lee",
    version: 3,
    downloadCount: 210,
    viewCount: 500,
    aiProcessed: true,
    aiSummary: "Vision, goals, growth plans for 2025.",
    aiTags: ["vision", "growth", "OKRs"],
    collaborators: [],
    parentFolder: "exec/strategy",
    path: "/exec/strategy/2025_Strategy_Deck.pdf",
    status: "synced",
    aiScore: 0.95,
    readingTime: 8,
    difficulty: "advanced",
    subject: "Business Strategy"
  },
  // 17 auto-generated entries with variety
  ...Array.from({ length: 17 }, (_, i) => {
    const idNum = 1729384728003 + i;
    const ext = ["pdf", "docx", "md", "pptx", "txt"][i % 5];
    const categories = ["Research", "Notes", "Tutorials", "Assignments", "Reports"];
    const difficulties = ["beginner", "intermediate", "advanced"];
    const statuses = ["synced", "syncing", "offline", "error"];
    const authors = ["Alice", "Bob", "Charlie", "Dana"];
    const folder = categories[i % categories.length].toLowerCase();
    return {
      id: idNum.toString(),
      name: `Mock_Document_${i + 4}`,
      type: ext,
      size: 100000 + (i * 5000),
      dateCreated: new Date(2025, 5, 10 + i, 9, 0, 0),
      dateModified: new Date(2025, 5, 10 + i, 10, 0, 0),
      tags: [`tag${i}`, `topic${i % 5}`],
      category: categories[i % categories.length],
      isStarred: i % 4 === 0,
      isShared: i % 3 === 0,
      isLocked: i % 5 === 0,
      thumbnail: "",
      description: `This is a mock document used for testing ${ext} type.`,
      author: authors[i % authors.length],
      version: 1 + (i % 2),
      downloadCount: i * 5,
      viewCount: i * 10,
      aiProcessed: i % 2 === 0,
      aiSummary: i % 2 === 0 ? `AI summary for document ${i + 4}` : null,
      aiTags: i % 2 === 0 ? [`auto-tag-${i}`, `keyword${i}`] : [],
      collaborators: i % 3 === 0 ? [`user_${(i % 4) + 1}`] : [],
      parentFolder: `${folder}/2025`,
      path: `/${folder}/2025/Mock_Document_${i + 4}.${ext}`,
      status: statuses[i % statuses.length],
      aiScore: i % 2 === 0 ? 0.75 + (i % 3) * 0.05 : null,
      readingTime: 2 + (i % 4),
      difficulty: difficulties[i % 3],
      subject: ["Math", "Science", "History", "Engineering"][i % 4]
    };
  })
];
