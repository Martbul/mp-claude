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
  Edit,
  Trash2,
  Download,
  Pin,
  Bookmark,
  SortAsc,
  SortDesc,
  LinkIcon,
  Brain,
  FolderIcon,
  Type,
  Network,
  Trash,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import type { DB_NoteFolderType, DB_NoteType } from "~/server/db/schema"
import { createNote as createNoteAction, starNoteAction, unstarNoteAction } from "~/server/actions";
import KanbanView from "./notesRenderView/KanbanView"
import GridView from "./notesRenderView/GridView"
import ListView from "./notesRenderView/ListView"
import MindmapView from "./notesRenderView/MindmapView"
import TimelineView from "./notesRenderView/TimelineView"

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

export default function NotesPage(props: { notes: DB_NoteType[], notesFolders: DB_NoteFolderType[], userId: string }) {
  const [notes, setNotes] = useState<DB_NoteType[]>(Array.isArray(props.notes) ? props.notes : [])
  const [folders, setFolders] = useState<DB_NoteFolderType[]>(Array.isArray(props.notesFolders) ? props.notesFolders : [])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortBy>("updated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedNotes, setSelectedNotes] = useState<number[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<DB_NoteType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "",
    tags: [] as string[],
    color: noteColors[0],
    priority: "medium" as DB_NoteType["priority"],
    folder: "",
  })

  // Filter and sort notes
  const filteredAndSortedNotes: DB_NoteType[] = useMemo(() => {
    const filtered = notes.filter((note) => {
      const noteTagsArray = Array.isArray(note.tags) ? note.tags : []

      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        noteTagsArray.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
          comparison = (a.category ?? "").localeCompare(b.category ?? "")
          break
        case "wordcount":
          comparison = a.wordCount - b.wordCount
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })
  }, [notes, searchTerm, selectedCategory, selectedFolder, sortBy, sortOrder])

  // Get unique categories
  const categories = Array.from(new Set(notes.map((note) => note.category).filter(Boolean)))

  // Toggle note selection
  const toggleNoteSelection = (noteId: number) => {
    setSelectedNotes((prev) => (prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]))
  }

  // Toggle note properties
  // //TODO: Persist pinned star to db(with optimisic and so on...)
  const toggleNotePinned = (noteId: number) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isPinned: !note.isPinned } : note)))
  }


  const toggleNoteStarred = async (noteId: number) => {
    // Optimistically update UI
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
      )
    );

    try {
      const result = await (notes.find(n => n.id === noteId)?.isStarred
        ? unstarNoteAction(props.userId, noteId)
        : starNoteAction(props.userId, noteId));

      if (result.success && result.data) {
        // Replace updated note with data from DB if available 
        const updatedNote = result.data as DB_NoteType;

        setNotes(prev =>
          prev.map(note =>
            note.id === noteId ? updatedNote : note
          )
        );
      } else {
        // Revert change on failure

        setNotes(prev =>
          prev.map(note =>
            note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
          )
        );
        console.error("Failed to star/unstar note", result.error);
      }
    } catch (error) {
      // Revert optimistic update on exception
      setNotes(prev =>
        prev.map(note =>
          note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
        )
      );
      console.error("Error toggling note star status", error);
    }
  };

  const toggleNoteBookmarked = (noteId: number) => {
    setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, isBookmarked: !note.isBookmarked } : note)))
  }

  // Delete note
  const deleteNote = (noteId: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    setSelectedNotes((prev) => prev.filter((id) => id !== noteId))
  }

  const createNote = async () => {
    const wordCount = newNote.content.split(" ").filter(word => word.length > 0).length;

    const optimisticNote: DB_NoteType = {
      id: Date.now(), // Temporary unique ID for optimistic update
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


    // Increase folder note count optimistically
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

    setIsCreateDialogOpen(false);

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

        setIsCreateDialogOpen(true);
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
      setIsCreateDialogOpen(true);
    }
  };




  const selectedNoteTags = Array.isArray(selectedNote?.tags) ? selectedNote.tags : []
  const selectedLinkedNotesArray = Array.isArray(selectedNote?.linkedNotes) ? selectedNote.linkedNotes : []

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
                                <SelectItem key={category} value={category!}>
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
                              setNewNote((prev) => ({ ...prev, priority: value as DB_NoteType["priority"] }))
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
                      <Button onClick={() => createNote()}>

                        Create Note
                      </Button>
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
                  <SelectItem key={category} value={category!}>
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

            {viewMode === "grid" && <GridView filteredAndSortedNotes={filteredAndSortedNotes} selectedNotes={selectedNotes} setSelectedNote={setSelectedNote} toggleNoteStarred={toggleNoteStarred} />}
            {viewMode === "list" && <ListView filteredAndSortedNotes={filteredAndSortedNotes} selectedNotes={selectedNotes} setSelectedNote={setSelectedNote} deleteNote={deleteNote} toggleNoteSelection={toggleNoteSelection} />}
            {viewMode === "kanban" && <KanbanView filteredAndSortedNotes={filteredAndSortedNotes} />}
            {viewMode === "timeline" && <TimelineView filteredAndSortedNotes={filteredAndSortedNotes} />}
            {viewMode === "mindmap" && <MindmapView filteredAndSortedNotes={filteredAndSortedNotes} categories={categories} noteColors={noteColors} />}

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
                      <Pin className="w-4 h-4 mr-2" />
                      Pin
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
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
                  {selectedNoteTags.map((tag, index) => (
                    <Badge key={index} variant="outline">
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

                {selectedLinkedNotesArray.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        Linked Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedLinkedNotesArray.map((linkedId, index) => {
                          const linkedNote = notes.find((n) => n.id === linkedId)
                          return linkedNote ? (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
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
