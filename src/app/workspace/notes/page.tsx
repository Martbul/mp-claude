
"use client"

import { useState, useMemo } from "react"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  Trello,
  Share,
  Star,
  Tag,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  Copy,
  Pin,
  Bookmark,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  LinkIcon,
  Brain,
  FolderIcon,
  Type,
  Network,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

// Types
interface Note {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  color: string
  isPinned: boolean
  isStarred: boolean
  isBookmarked: boolean
  createdAt: Date
  updatedAt: Date
  author: string
  wordCount: number
  readingTime: number
  priority: "low" | "medium" | "high"
  status: "draft" | "in-progress" | "completed" | "archived"
  template?: string
  linkedNotes: string[]
  attachments: string[]
  collaborators: string[]
  aiGenerated: boolean
  aiSummary?: string
  version: number
  isShared: boolean
  viewCount: number
  folder?: string
}

interface NoteFolder {
  id: string
  name: string
  color: string
  noteCount: number
  isExpanded: boolean
  parentId?: string
}

interface NoteTemplate {
  id: string
  name: string
  description: string
  content: string
  category: string
  icon: string
}

type ViewMode = "grid" | "list" | "kanban" | "timeline" | "mindmap"
type SortBy = "updated" | "created" | "title" | "category" | "wordcount"

// Sample data
const noteColors = [
  "#FFE4E1",
  "#E1F5FE",
  "#E8F5E8",
  "#FFF3E0",
  "#F3E5F5",
  "#E0F2F1",
  "#FFF8E1",
  "#FCE4EC",
  "#E3F2FD",
  "#F1F8E9",
]

const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Calculus Integration Techniques",
    content:
      "# Integration Techniques\n\n## By Parts\nUsed when we have a product of functions...\n\n## Substitution\nWhen we can identify an inner function...",
    excerpt:
      "Comprehensive notes on various integration techniques including by parts, substitution, and partial fractions.",
    category: "Mathematics",
    tags: ["calculus", "integration", "techniques", "formulas"],
    color: "#E3F2FD",
    isPinned: true,
    isStarred: true,
    isBookmarked: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-18"),
    author: "You",
    wordCount: 847,
    readingTime: 4,
    priority: "high",
    status: "completed",
    linkedNotes: ["2", "5"],
    attachments: ["integration-formulas.pdf"],
    collaborators: [],
    aiGenerated: false,
    version: 3,
    isShared: false,
    viewCount: 25,
    folder: "math-core",
  },
  {
    id: "2",
    title: "Quantum Mechanics Principles",
    content:
      "# Quantum Mechanics\n\n## Wave-Particle Duality\nLight exhibits both wave and particle properties...\n\n## Uncertainty Principle\nHeisenberg's principle states...",
    excerpt: "Fundamental principles of quantum mechanics including wave-particle duality and uncertainty principle.",
    category: "Physics",
    tags: ["quantum", "mechanics", "physics", "principles"],
    color: "#E8F5E8",
    isPinned: false,
    isStarred: true,
    isBookmarked: true,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-16"),
    author: "You",
    wordCount: 1205,
    readingTime: 6,
    priority: "high",
    status: "in-progress",
    linkedNotes: ["1"],
    attachments: [],
    collaborators: ["lab.partner"],
    aiGenerated: true,
    aiSummary: "Comprehensive overview of quantum mechanical principles with focus on foundational concepts.",
    version: 2,
    isShared: true,
    viewCount: 42,
    folder: "physics-advanced",
  },
  {
    id: "3",
    title: "Organic Chemistry Reactions",
    content:
      "# Organic Reactions\n\n## Addition Reactions\nAlkenes undergo addition reactions...\n\n## Substitution Reactions\nSN1 and SN2 mechanisms...",
    excerpt: "Study notes on major organic chemistry reaction types including addition, substitution, and elimination.",
    category: "Chemistry",
    tags: ["organic", "reactions", "mechanisms", "chemistry"],
    color: "#FFF3E0",
    isPinned: false,
    isStarred: false,
    isBookmarked: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-14"),
    author: "You",
    wordCount: 692,
    readingTime: 3,
    priority: "medium",
    status: "draft",
    linkedNotes: [],
    attachments: ["reaction-mechanisms.png"],
    collaborators: [],
    aiGenerated: false,
    version: 1,
    isShared: false,
    viewCount: 18,
    folder: "chemistry-organic",
  },
  {
    id: "4",
    title: "World War II Timeline",
    content:
      "# WWII Timeline\n\n## 1939\n- September 1: Germany invades Poland...\n\n## 1940\n- Battle of Britain begins...",
    excerpt: "Chronological timeline of major World War II events and their historical significance.",
    category: "History",
    tags: ["wwii", "timeline", "history", "war"],
    color: "#F3E5F5",
    isPinned: false,
    isStarred: false,
    isBookmarked: true,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-12"),
    author: "You",
    wordCount: 1543,
    readingTime: 8,
    priority: "medium",
    status: "completed",
    linkedNotes: [],
    attachments: [],
    collaborators: ["study.group"],
    aiGenerated: false,
    version: 4,
    isShared: true,
    viewCount: 67,
    folder: "history-modern",
  },
  {
    id: "5",
    title: "Data Structures Overview",
    content:
      "# Data Structures\n\n## Arrays\nContiguous memory allocation...\n\n## Linked Lists\nDynamic memory allocation...",
    excerpt:
      "Comprehensive overview of fundamental data structures including arrays, linked lists, stacks, and queues.",
    category: "Computer Science",
    tags: ["data-structures", "algorithms", "programming", "cs"],
    color: "#E0F2F1",
    isPinned: true,
    isStarred: false,
    isBookmarked: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-20"),
    author: "You",
    wordCount: 1876,
    readingTime: 9,
    priority: "high",
    status: "in-progress",
    linkedNotes: ["1"],
    attachments: ["complexity-chart.pdf", "examples.cpp"],
    collaborators: [],
    aiGenerated: true,
    aiSummary: "Detailed explanation of data structures with complexity analysis and implementation examples.",
    version: 6,
    isShared: false,
    viewCount: 33,
    folder: "cs-fundamentals",
  },
  {
    id: "6",
    title: "Literary Analysis - Shakespeare",
    content:
      "# Shakespeare Analysis\n\n## Themes in Hamlet\nRevenge, madness, mortality...\n\n## Character Development\nHamlet's psychological journey...",
    excerpt: "In-depth analysis of Shakespearean themes, character development, and literary techniques.",
    category: "Literature",
    tags: ["shakespeare", "hamlet", "analysis", "literature"],
    color: "#FCE4EC",
    isPinned: false,
    isStarred: true,
    isBookmarked: true,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-10"),
    author: "You",
    wordCount: 2134,
    readingTime: 11,
    priority: "low",
    status: "completed",
    linkedNotes: [],
    attachments: ["hamlet-quotes.txt"],
    collaborators: ["english.teacher"],
    aiGenerated: false,
    version: 2,
    isShared: true,
    viewCount: 89,
    folder: "literature-classic",
  },
  {
    id: "7",
    title: "Quick Study Tips",
    content: "# Study Tips\n\n- Use active recall\n- Space out learning sessions\n- Practice retrieval\n- Teach others",
    excerpt: "Quick reference for effective study techniques and learning strategies.",
    category: "Study Tips",
    tags: ["tips", "studying", "learning", "productivity"],
    color: "#FFF8E1",
    isPinned: false,
    isStarred: false,
    isBookmarked: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    author: "You",
    wordCount: 156,
    readingTime: 1,
    priority: "low",
    status: "draft",
    linkedNotes: [],
    attachments: [],
    collaborators: [],
    aiGenerated: true,
    aiSummary: "Concise list of evidence-based study techniques for better learning outcomes.",
    version: 1,
    isShared: false,
    viewCount: 5,
  },
]

const sampleFolders: NoteFolder[] = [
  { id: "math-core", name: "Core Mathematics", color: "#2196F3", noteCount: 12, isExpanded: true },
  { id: "physics-advanced", name: "Advanced Physics", color: "#4CAF50", noteCount: 8, isExpanded: false },
  { id: "chemistry-organic", name: "Organic Chemistry", color: "#FF9800", noteCount: 15, isExpanded: false },
  { id: "history-modern", name: "Modern History", color: "#9C27B0", noteCount: 6, isExpanded: false },
  { id: "cs-fundamentals", name: "CS Fundamentals", color: "#00BCD4", noteCount: 22, isExpanded: true },
  { id: "literature-classic", name: "Classic Literature", color: "#E91E63", noteCount: 9, isExpanded: false },
]

const noteTemplates: NoteTemplate[] = [
  {
    id: "lecture",
    name: "Lecture Notes",
    description: "Template for taking lecture notes",
    content:
      "# Lecture: [Topic]\n\n**Date:** \n**Professor:** \n\n## Key Points\n\n## Details\n\n## Questions\n\n## Action Items",
    category: "Academic",
    icon: "📚",
  },
  {
    id: "meeting",
    name: "Meeting Notes",
    description: "Template for meeting notes",
    content:
      "# Meeting: [Title]\n\n**Date:** \n**Attendees:** \n\n## Agenda\n\n## Discussion Points\n\n## Decisions Made\n\n## Next Steps",
    category: "Professional",
    icon: "🤝",
  },
  {
    id: "research",
    name: "Research Notes",
    description: "Template for research documentation",
    content:
      "# Research: [Topic]\n\n**Research Question:** \n**Hypothesis:** \n\n## Literature Review\n\n## Methodology\n\n## Findings\n\n## Conclusions",
    category: "Academic",
    icon: "🔬",
  },
  {
    id: "study-guide",
    name: "Study Guide",
    description: "Template for exam preparation",
    content:
      "# Study Guide: [Subject]\n\n**Exam Date:** \n**Format:** \n\n## Key Concepts\n\n## Formulas\n\n## Practice Problems\n\n## Review Schedule",
    category: "Academic",
    icon: "📖",
  },
]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(sampleNotes)
  const [folders, setFolders] = useState<NoteFolder[]>(sampleFolders)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortBy>("updated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "",
    tags: [] as string[],
    color: noteColors[0],
    priority: "medium" as Note["priority"],
    folder: "",
  })

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    const filtered = notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        note.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || note.category === selectedCategory
      const matchesFolder = !selectedFolder || note.folder === selectedFolder

      return matchesSearch && matchesCategory && matchesFolder
    })

    return filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "updated":
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
          break
        case "created":
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "category":
          comparison = a.category.localeCompare(b.category)
          break
        case "wordcount":
          comparison = a.wordCount - b.wordCount
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })
  }, [notes, searchTerm, selectedCategory, selectedFolder, sortBy, sortOrder])

  // Get unique categories
  const categories = Array.from(new Set(notes.map((note) => note.category)))

  // Toggle note selection
  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes((prev) => (prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]))
  }

  // Toggle note properties
  const toggleNotePinned = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isPinned: !note.isPinned } : note)))
  }

  const toggleNoteStarred = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isStarred: !note.isStarred } : note)))
  }

  const toggleNoteBookmarked = (noteId: string) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isBookmarked: !note.isBookmarked } : note)))
  }

  // Delete note
  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    setSelectedNotes((prev) => prev.filter((id) => id !== noteId))
  }

  // Create new note
  const createNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title || "Untitled Note",
      content: newNote.content,
      excerpt: newNote.content.substring(0, 150) + "...",
      category: newNote.category || "Uncategorized",
      tags: newNote.tags,
      color: newNote.color,
      isPinned: false,
      isStarred: false,
      isBookmarked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: "You",
      wordCount: newNote.content.split(" ").length,
      readingTime: Math.ceil(newNote.content.split(" ").length / 200),
      priority: newNote.priority,
      status: "draft",
      linkedNotes: [],
      attachments: [],
      collaborators: [],
      aiGenerated: false,
      version: 1,
      isShared: false,
      viewCount: 0,
      folder: newNote.folder,
    }

    setNotes((prev) => [...prev, note])
    setNewNote({
      title: "",
      content: "",
      category: "",
      tags: [],
      color: noteColors[0],
      priority: "medium",
      folder: "",
    })
    setIsCreateDialogOpen(false)
  }

  // Render different views
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Pinned notes first */}
      {filteredAndSortedNotes
        .filter((note) => note.isPinned)
        .map((note) => (
          <NoteCard key={`pinned-${note.id}`} note={note} isPinned />
        ))}
      {/* Regular notes */}
      {filteredAndSortedNotes
        .filter((note) => !note.isPinned)
        .map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-2">
      {filteredAndSortedNotes.map((note) => (
        <Card
          key={note.id}
          className={`hover:shadow-md transition-all cursor-pointer ${selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""
            }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedNotes.includes(note.id)}
                onCheckedChange={() => toggleNoteSelection(note.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: note.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  {note.isPinned && <Pin className="w-4 h-4 text-gray-600" />}
                  {note.isStarred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                  {note.isBookmarked && <Bookmark className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-sm text-gray-600 truncate">{note.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span>{note.category}</span>
                  <span>{note.wordCount} words</span>
                  <span>{note.updatedAt.toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {note.viewCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {note.priority}
                </Badge>
                <Badge variant={note.status === "completed" ? "default" : "secondary"} className="text-xs">
                  {note.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedNote(note)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteNote(note.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderKanbanView = () => {
    const statusColumns = [
      { id: "draft", title: "Draft", notes: filteredAndSortedNotes.filter((n) => n.status === "draft") },
      {
        id: "in-progress",
        title: "In Progress",
        notes: filteredAndSortedNotes.filter((n) => n.status === "in-progress"),
      },
      { id: "completed", title: "Completed", notes: filteredAndSortedNotes.filter((n) => n.status === "completed") },
      { id: "archived", title: "Archived", notes: filteredAndSortedNotes.filter((n) => n.status === "archived") },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusColumns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary">{column.notes.length}</Badge>
            </div>
            <div className="space-y-3">
              {column.notes.map((note) => (
                <Card key={note.id} className="p-3 hover:shadow-md transition-all cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm truncate pr-2">{note.title}</h4>
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: note.color }} />
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{note.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {note.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {note.isPinned && <Pin className="w-3 h-3 text-gray-600" />}
                        {note.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                        {note.aiGenerated && <Brain className="w-3 h-3 text-purple-600" />}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {note.wordCount} words • {note.readingTime}min read
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderTimelineView = () => {
    const groupedByDate = filteredAndSortedNotes.reduce(
      (acc, note) => {
        const date = note.updatedAt.toDateString()
        if (!acc[date]) acc[date] = []
        acc[date].push(note)
        return acc
      },
      {} as Record<string, Note[]>,
    )

    return (
      <div className="space-y-8">
        {Object.entries(groupedByDate).map(([date, dayNotes]) => (
          <div key={date} className="relative">
            <div className="sticky top-0 bg-white z-10 py-2 border-b">
              <h3 className="font-semibold text-lg">{date}</h3>
            </div>
            <div className="mt-4 space-y-4 relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
              {dayNotes.map((note, index) => (
                <div key={note.id} className="relative flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: note.color }} />
                  </div>
                  <Card className="flex-1 hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{note.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {note.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {note.updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{note.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{note.wordCount} words</span>
                          <span>{note.readingTime}min read</span>
                          <span>v{note.version}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderMindMapView = () => {
    // Group notes by category for mind map visualization
    const categoryGroups = categories.map((category) => ({
      category,
      notes: filteredAndSortedNotes.filter((note) => note.category === category),
      color: noteColors[categories.indexOf(category) % noteColors.length],
    }))

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-lg font-bold">
            My Notes
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryGroups.map((group) => (
            <div key={group.category} className="space-y-4">
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full text-white font-semibold"
                  style={{ backgroundColor: group.color }}
                >
                  {group.category}
                </div>
                <div className="mt-2 text-sm text-gray-600">{group.notes.length} notes</div>
              </div>

              <div className="space-y-2">
                {group.notes.slice(0, 5).map((note) => (
                  <Card key={note.id} className="p-3 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: note.color }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{note.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{note.wordCount} words</span>
                          {note.linkedNotes.length > 0 && (
                            <span className="flex items-center gap-1">
                              <LinkIcon className="w-3 h-3" />
                              {note.linkedNotes.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {note.isPinned && <Pin className="w-3 h-3 text-gray-600" />}
                        {note.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                      </div>
                    </div>
                  </Card>
                ))}
                {group.notes.length > 5 && (
                  <div className="text-center text-sm text-gray-500">+{group.notes.length - 5} more notes</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Note Card Component
  const NoteCard = ({ note, isPinned = false }: { note: Note; isPinned?: boolean }) => (
    <Card
      className={`group hover:shadow-lg transition-all cursor-pointer ${selectedNotes.includes(note.id) ? "ring-2 ring-blue-500" : ""
        } ${isPinned ? "border-yellow-200 bg-yellow-50/30" : ""}`}
      style={{ backgroundColor: note.color }}
      onClick={() => setSelectedNote(note)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              {isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
              <h3 className="font-medium text-sm truncate">{note.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {note.category}
              </Badge>
              {note.aiGenerated && (
                <Badge variant="secondary" className="text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleNoteStarred(note.id)
              }}
            >
              <Star className={`w-4 h-4 ${note.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => toggleNotePinned(note.id)}>
                  <Pin className="w-4 h-4 mr-2" />
                  {note.isPinned ? "Unpin" : "Pin"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleNoteBookmarked(note.id)}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  {note.isBookmarked ? "Remove Bookmark" : "Bookmark"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteNote(note.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-700 line-clamp-3">{note.excerpt}</p>

          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <span>{note.wordCount} words</span>
              <span>{note.readingTime}min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {note.updatedAt.toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {note.isBookmarked && <Bookmark className="w-4 h-4 text-blue-600" />}
              {note.isShared && <Share className="w-4 h-4 text-green-600" />}
              {note.linkedNotes.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <LinkIcon className="w-3 h-3" />
                  {note.linkedNotes.length}
                </span>
              )}
            </div>
            <Badge
              variant={note.priority === "high" ? "destructive" : note.priority === "medium" ? "default" : "secondary"}
              className="text-xs"
            >
              {note.priority}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              Study Notes
            </h1>
            <Badge variant="secondary" className="text-sm">
              {notes.length} notes
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                  <DialogDescription>Create a new note or choose from templates</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="blank" className="w-full">
                  <TabsList>
                    <TabsTrigger value="blank">Blank Note</TabsTrigger>
                    <TabsTrigger value="template">From Template</TabsTrigger>
                  </TabsList>
                  <TabsContent value="blank" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newNote.title}
                            onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter note title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newNote.category}
                            onValueChange={(value) => setNewNote((prev) => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                              <SelectItem value="new">Add New Category</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newNote.priority}
                            onValueChange={(value) =>
                              setNewNote((prev) => ({ ...prev, priority: value as Note["priority"] }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Color</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {noteColors.map((color) => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded-full border-2 ${newNote.color === color ? "border-gray-800" : "border-gray-300"}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setNewNote((prev) => ({ ...prev, color }))}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newNote.content}
                          onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                          placeholder="Start writing your note..."
                          className="min-h-[300px]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createNote}>Create Note</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="template" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {noteTemplates.map((template) => (
                        <Card key={template.id} className="cursor-pointer hover:shadow-md transition-all">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <span className="text-2xl">{template.icon}</span>
                              {template.name}
                            </CardTitle>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </CardHeader>
                          <CardContent>
                            <Button
                              className="w-full"
                              onClick={() => {
                                setNewNote((prev) => ({
                                  ...prev,
                                  content: template.content,
                                  category: template.category,
                                }))
                              }}
                            >
                              Use Template
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Notes</p>
                  <p className="text-2xl font-bold">{notes.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pinned</p>
                  <p className="text-2xl font-bold">{notes.filter((n) => n.isPinned).length}</p>
                </div>
                <Pin className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Starred</p>
                  <p className="text-2xl font-bold">{notes.filter((n) => n.isStarred).length}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Words</p>
                  <p className="text-2xl font-bold">
                    {notes.reduce((sum, n) => sum + n.wordCount, 0).toLocaleString()}
                  </p>
                </div>
                <Type className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">AI Generated</p>
                  <p className="text-2xl font-bold">{notes.filter((n) => n.aiGenerated).length}</p>
                </div>
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search notes, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-80"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="wordcount">Word Count</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
            >
              <Trello className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              <Calendar className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "mindmap" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("mindmap")}
            >
              <Network className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Folders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedFolder === null ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder(null)}
                  >
                    <FolderIcon className="w-4 h-4 mr-2" />
                    All Notes
                    <Badge variant="secondary" className="ml-auto">
                      {notes.length}
                    </Badge>
                  </Button>
                  {folders.map((folder) => (
                    <Button
                      key={folder.id}
                      variant={selectedFolder === folder.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: folder.color }} />
                      {folder.name}
                      <Badge variant="secondary" className="ml-auto">
                        {folder.noteCount}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Pin className="w-4 h-4 mr-2" />
                    Pinned ({notes.filter((n) => n.isPinned).length})
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Starred ({notes.filter((n) => n.isStarred).length})
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarked ({notes.filter((n) => n.isBookmarked).length})
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Generated ({notes.filter((n) => n.aiGenerated).length})
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Share className="w-4 h-4 mr-2" />
                    Shared ({notes.filter((n) => n.isShared).length})
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notes
                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                    .slice(0, 5)
                    .map((note) => (
                      <div key={note.id} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: note.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{note.title}</p>
                          <p className="text-xs text-gray-500">{note.updatedAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            {selectedNotes.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{selectedNotes.length} notes selected</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Tag className="w-4 h-4 mr-2" />
                        Add Tags
                      </Button>
                      <Button size="sm" variant="outline">
                        <FolderIcon className="w-4 h-4 mr-2" />
                        Move to Folder
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {viewMode === "grid" && renderGridView()}
            {viewMode === "list" && renderListView()}
            {viewMode === "kanban" && renderKanbanView()}
            {viewMode === "timeline" && renderTimelineView()}
            {viewMode === "mindmap" && renderMindMapView()}

            {filteredAndSortedNotes.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notes found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedCategory !== "all" || selectedFolder
                      ? "Try adjusting your filters or search terms"
                      : "Create your first note to get started"}
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Note
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Note Details Modal */}
        {selectedNote && (
          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedNote.color }} />
                    {selectedNote.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Category: {selectedNote.category}</span>
                  <span>•</span>
                  <span>{selectedNote.wordCount} words</span>
                  <span>•</span>
                  <span>{selectedNote.readingTime} min read</span>
                  <span>•</span>
                  <span>Updated {selectedNote.updatedAt.toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedNote.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{selectedNote.content}</div>
                </div>

                {selectedNote.aiSummary && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        AI Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{selectedNote.aiSummary}</p>
                    </CardContent>
                  </Card>
                )}

                {selectedNote.linkedNotes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        Linked Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedNote.linkedNotes.map((linkedId) => {
                          const linkedNote = notes.find((n) => n.id === linkedId)
                          return linkedNote ? (
                            <div key={linkedId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: linkedNote.color }} />
                              <span className="text-sm">{linkedNote.title}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
