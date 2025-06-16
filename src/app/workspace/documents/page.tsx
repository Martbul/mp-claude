"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
import {
  FileText,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Download,
  Share2,
  Eye,
  Trash2,
  FolderPlus,
  Tag,
  Clock,
  Users,
  Lock,
  Move,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  BarChart3,
  Zap,
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  FileImage,
  FileVideo,
  FileAudio,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileCode,
  FolderIcon,
  FolderOpen,
  CloudUpload,
  HardDrive,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"

// Types
interface Document {
  id: string
  name: string
  type: "pdf" | "docx" | "pptx" | "xlsx" | "txt" | "image" | "video" | "audio" | "code" | "other"
  size: number
  dateCreated: Date
  dateModified: Date
  tags: string[]
  category: string
  isStarred: boolean
  isShared: boolean
  isLocked: boolean
  thumbnail?: string
  description?: string
  author: string
  version: number
  downloadCount: number
  viewCount: number
  aiProcessed: boolean
  aiSummary?: string
  aiTags?: string[]
  collaborators: string[]
  parentFolder?: string
  path: string
  status: "synced" | "syncing" | "offline" | "error"
  aiScore?: number
  readingTime?: number
  difficulty?: "beginner" | "intermediate" | "advanced"
  subject?: string
}

interface Folder {
  id: string
  name: string
  parentId?: string
  children: string[]
  documentCount: number
  isExpanded: boolean
  color: string
  description?: string
  isShared: boolean
  createdDate: Date
}

type ViewMode = "grid" | "list" | "timeline" | "kanban"
type SortBy = "name" | "date" | "size" | "type" | "views" | "ai-score"

// Sample data
const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "Calculus Final Study Guide.pdf",
    type: "pdf",
    size: 2400000,
    dateCreated: new Date("2024-01-10"),
    dateModified: new Date("2024-01-15"),
    tags: ["calculus", "final", "study-guide", "math"],
    category: "Mathematics",
    isStarred: true,
    isShared: false,
    isLocked: false,
    author: "Prof. Johnson",
    version: 3,
    downloadCount: 45,
    viewCount: 128,
    aiProcessed: true,
    aiSummary: "Comprehensive calculus study guide covering derivatives, integrals, and applications.",
    aiTags: ["derivatives", "integrals", "limits", "applications"],
    collaborators: ["sarah.chen", "mike.wilson"],
    path: "/Mathematics/Calculus",
    status: "synced",
    aiScore: 92,
    readingTime: 45,
    difficulty: "advanced",
    subject: "Mathematics",
  },
  {
    id: "2",
    name: "Physics Lab Report - Quantum Mechanics.docx",
    type: "docx",
    size: 1200000,
    dateCreated: new Date("2024-01-12"),
    dateModified: new Date("2024-01-18"),
    tags: ["physics", "lab", "quantum", "report"],
    category: "Physics",
    isStarred: false,
    isShared: true,
    isLocked: false,
    author: "You",
    version: 1,
    downloadCount: 12,
    viewCount: 34,
    aiProcessed: true,
    aiSummary: "Lab report analyzing quantum mechanical phenomena and wave-particle duality.",
    collaborators: ["lab.partner"],
    path: "/Physics/Lab Reports",
    status: "syncing",
    aiScore: 88,
    readingTime: 25,
    difficulty: "advanced",
    subject: "Physics",
  },
  {
    id: "3",
    name: "Chemistry Notes - Organic Compounds.txt",
    type: "txt",
    size: 45000,
    dateCreated: new Date("2024-01-08"),
    dateModified: new Date("2024-01-20"),
    tags: ["chemistry", "organic", "notes", "compounds"],
    category: "Chemistry",
    isStarred: true,
    isShared: false,
    isLocked: false,
    author: "You",
    version: 5,
    downloadCount: 8,
    viewCount: 67,
    aiProcessed: true,
    aiSummary: "Detailed notes on organic compound structures and reactions.",
    collaborators: [],
    path: "/Chemistry/Notes",
    status: "synced",
    aiScore: 85,
    readingTime: 15,
    difficulty: "intermediate",
    subject: "Chemistry",
  },
  {
    id: "4",
    name: "History Presentation - World War II.pptx",
    type: "pptx",
    size: 8900000,
    dateCreated: new Date("2024-01-05"),
    dateModified: new Date("2024-01-14"),
    tags: ["history", "wwii", "presentation", "war"],
    category: "History",
    isStarred: false,
    isShared: true,
    isLocked: false,
    author: "You",
    version: 2,
    downloadCount: 23,
    viewCount: 89,
    aiProcessed: false,
    collaborators: ["group.member1", "group.member2"],
    path: "/History/Presentations",
    status: "synced",
    readingTime: 30,
    difficulty: "intermediate",
    subject: "History",
  },
  {
    id: "5",
    name: "Data Analysis Spreadsheet.xlsx",
    type: "xlsx",
    size: 567000,
    dateCreated: new Date("2024-01-16"),
    dateModified: new Date("2024-01-19"),
    tags: ["data", "analysis", "statistics", "excel"],
    category: "Statistics",
    isStarred: false,
    isShared: false,
    isLocked: true,
    author: "You",
    version: 1,
    downloadCount: 5,
    viewCount: 15,
    aiProcessed: true,
    aiSummary: "Statistical analysis of research data with charts and correlations.",
    collaborators: [],
    path: "/Statistics/Data",
    status: "offline",
    aiScore: 78,
    readingTime: 20,
    difficulty: "advanced",
    subject: "Statistics",
  },
]

const sampleFolders: Folder[] = [
  {
    id: "math",
    name: "Mathematics",
    children: ["calculus", "algebra"],
    documentCount: 15,
    isExpanded: true,
    color: "blue",
    isShared: false,
    createdDate: new Date("2024-01-01"),
  },
  {
    id: "physics",
    name: "Physics",
    children: ["mechanics", "quantum"],
    documentCount: 8,
    isExpanded: false,
    color: "green",
    isShared: true,
    createdDate: new Date("2024-01-02"),
  },
  {
    id: "chemistry",
    name: "Chemistry",
    children: ["organic", "inorganic"],
    documentCount: 12,
    isExpanded: false,
    color: "purple",
    isShared: false,
    createdDate: new Date("2024-01-03"),
  },
]

const fileTypeIcons = {
  pdf: FilePdf,
  docx: FileText,
  pptx: FileImage,
  xlsx: FileSpreadsheet,
  txt: FileText,
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  code: FileCode,
  other: FileText,
}

const statusColors = {
  synced: "text-green-600",
  syncing: "text-yellow-600",
  offline: "text-gray-600",
  error: "text-red-600",
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments)
  const [folders, setFolders] = useState<Folder[]>(sampleFolders)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<SortBy>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
      const matchesFolder = !currentFolder || doc.path.includes(currentFolder)
      return matchesSearch && matchesCategory && matchesFolder
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "date":
          comparison = a.dateModified.getTime() - b.dateModified.getTime()
          break
        case "size":
          comparison = a.size - b.size
          break
        case "type":
          comparison = a.type.localeCompare(b.type)
          break
        case "views":
          comparison = a.viewCount - b.viewCount
          break
        case "ai-score":
          comparison = (a.aiScore || 0) - (b.aiScore || 0)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  // Handle file upload
  const handleFileUpload = useCallback(
    (files: FileList) => {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            setIsUploadDialogOpen(false)
            return 100
          }
          return prev + 10
        })
      }, 200)

      // Process files (simulation)
      Array.from(files).forEach((file) => {
        const newDoc: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: getFileType(file.name),
          size: file.size,
          dateCreated: new Date(),
          dateModified: new Date(),
          tags: [],
          category: "Uncategorized",
          isStarred: false,
          isShared: false,
          isLocked: false,
          author: "You",
          version: 1,
          downloadCount: 0,
          viewCount: 0,
          aiProcessed: false,
          collaborators: [],
          path: currentFolder || "/",
          status: "syncing",
        }
        setDocuments((prev) => [...prev, newDoc])
      })
    },
    [currentFolder],
  )

  const getFileType = (filename: string): Document["type"] => {
    const ext = filename.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "pdf":
        return "pdf"
      case "doc":
      case "docx":
        return "docx"
      case "ppt":
      case "pptx":
        return "pptx"
      case "xls":
      case "xlsx":
        return "xlsx"
      case "txt":
        return "txt"
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "image"
      case "mp4":
      case "avi":
      case "mov":
        return "video"
      case "mp3":
      case "wav":
        return "audio"
      case "js":
      case "ts":
      case "py":
      case "java":
        return "code"
      default:
        return "other"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const toggleStar = (docId: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc)))
  }

  const deleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId))
    setSelectedDocuments((prev) => prev.filter((id) => id !== docId))
  }

  const categories = Array.from(new Set(documents.map((doc) => doc.category)))

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredDocuments.map((doc) => {
        const IconComponent = fileTypeIcons[doc.type]
        return (
          <Card
            key={doc.id}
            className={`group hover:shadow-lg transition-all cursor-pointer ${selectedDocuments.includes(doc.id) ? "ring-2 ring-blue-500" : ""
              }`}
            onClick={() => setSelectedDocument(doc)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStar(doc.id)
                    }}
                  >
                    <Star className={`w-4 h-4 ${doc.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deleteDocument(doc.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {doc.dateModified.toLocaleDateString()}
                  <div className={`w-2 h-2 rounded-full ${statusColors[doc.status]}`} />
                </div>
                {doc.aiProcessed && (
                  <div className="flex items-center gap-1">
                    <Brain className="w-3 h-3 text-purple-600" />
                    <span className="text-xs text-purple-600">AI Processed</span>
                    {doc.aiScore && (
                      <Badge variant="secondary" className="text-xs">
                        {doc.aiScore}%
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {doc.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {doc.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{doc.tags.length - 3}
                    </Badge>
                  )}
                </div>
                {doc.difficulty && (
                  <Badge className={`text-xs ${difficultyColors[doc.difficulty]}`}>{doc.difficulty}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-2">
      {filteredDocuments.map((doc) => {
        const IconComponent = fileTypeIcons[doc.type]
        return (
          <Card
            key={doc.id}
            className={`p-4 hover:shadow-md transition-all cursor-pointer ${selectedDocuments.includes(doc.id) ? "ring-2 ring-blue-500" : ""
              }`}
            onClick={() => setSelectedDocument(doc)}
          >
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedDocuments.includes(doc.id)}
                onCheckedChange={() => toggleDocumentSelection(doc.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <IconComponent className="w-6 h-6 text-blue-600" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{doc.name}</h3>
                  {doc.isStarred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                  {doc.isShared && <Users className="w-4 h-4 text-green-600" />}
                  {doc.isLocked && <Lock className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>{doc.dateModified.toLocaleDateString()}</span>
                  <span>{doc.author}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {doc.viewCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {doc.aiProcessed && (
                  <Badge variant="secondary" className="text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    AI: {doc.aiScore}%
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {doc.category}
                </Badge>
                <div className={`w-2 h-2 rounded-full ${statusColors[doc.status]}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )

  const renderTimelineView = () => (
    <div className="space-y-6">
      {Object.entries(
        filteredDocuments.reduce(
          (acc, doc) => {
            const date = doc.dateModified.toDateString()
            if (!acc[date]) acc[date] = []
            acc[date].push(doc)
            return acc
          },
          {} as Record<string, Document[]>,
        ),
      ).map(([date, docs]) => (
        <div key={date} className="relative">
          <div className="sticky top-0 bg-white z-10 py-2 border-b">
            <h3 className="font-semibold text-lg">{date}</h3>
          </div>
          <div className="mt-4 space-y-2">
            {docs.map((doc) => {
              const IconComponent = fileTypeIcons[doc.type]
              return (
                <Card key={doc.id} className="p-3 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-gray-500">
                        {doc.category} • {formatFileSize(doc.size)}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {doc.dateModified.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  const renderKanbanView = () => {
    const columns = [
      { id: "to-review", title: "To Review", docs: filteredDocuments.filter((d) => !d.aiProcessed) },
      { id: "in-progress", title: "In Progress", docs: filteredDocuments.filter((d) => d.status === "syncing") },
      {
        id: "completed",
        title: "Completed",
        docs: filteredDocuments.filter((d) => d.aiProcessed && d.status === "synced"),
      },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary">{column.docs.length}</Badge>
            </div>
            <div className="space-y-2">
              {column.docs.map((doc) => {
                const IconComponent = fileTypeIcons[doc.type]
                return (
                  <Card key={doc.id} className="p-3 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start gap-2">
                      <IconComponent className="w-4 h-4 text-blue-600 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                        <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Document Hub
            </h1>
            <Badge variant="secondary" className="text-sm">
              {documents.length} documents
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowAIInsights(!showAIInsights)}>
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
                  <DialogDescription>Drag and drop files or click to browse</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const files = e.dataTransfer.files
                      if (files.length > 0) {
                        handleFileUpload(files)
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium">Drop files here or click to browse</p>
                    <p className="text-sm text-gray-500">Supports PDF, DOCX, PPTX, XLSX, TXT, and more</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(e.target.files)
                      }
                    }}
                  />
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold">{documents.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">AI Processed</p>
                  <p className="text-2xl font-bold">{documents.filter((d) => d.aiProcessed).length}</p>
                </div>
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold">{documents.reduce((sum, d) => sum + d.viewCount, 0)}</p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Storage Used</p>
                  <p className="text-2xl font-bold">{formatFileSize(documents.reduce((sum, d) => sum + d.size, 0))}</p>
                </div>
                <HardDrive className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        {showAIInsights && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Study Recommendations
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>• Focus on Calculus - 3 unreviewed documents</p>
                    <p>• Physics lab report needs attention</p>
                    <p>• Chemistry notes have high engagement</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Usage Patterns
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>• Most active: Weekday evenings</p>
                    <p>• Preferred format: PDF documents</p>
                    <p>• Average reading time: 25 minutes</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Quick Actions
                  </h4>
                  <div className="space-y-1">
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Brain className="w-3 h-3 mr-2" />
                      Process 4 pending documents
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Tag className="w-3 h-3 mr-2" />
                      Auto-tag unorganized files
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search documents, tags, or content..."
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
                <SelectItem value="date">Date Modified</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">File Size</SelectItem>
                <SelectItem value="type">File Type</SelectItem>
                <SelectItem value="views">View Count</SelectItem>
                <SelectItem value="ai-score">AI Score</SelectItem>
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
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              <Clock className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
            >
              <BarChart3 className="w-4 h-4" />
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
                    variant={currentFolder === null ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentFolder(null)}
                  >
                    <FolderIcon className="w-4 h-4 mr-2" />
                    All Documents
                  </Button>
                  {folders.map((folder) => (
                    <Button
                      key={folder.id}
                      variant={currentFolder === folder.name ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentFolder(folder.name)}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {folder.name}
                      <Badge variant="secondary" className="ml-auto">
                        {folder.documentCount}
                      </Badge>
                    </Button>
                  ))}
                  <Button variant="ghost" className="w-full justify-start">
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
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
                    <Star className="w-4 h-4 mr-2" />
                    Starred ({documents.filter((d) => d.isStarred).length})
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Shared ({documents.filter((d) => d.isShared).length})
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Processed ({documents.filter((d) => d.aiProcessed).length})
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>8.2 GB of 15 GB</span>
                  </div>
                  <Progress value={55} />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Documents</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Images</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Videos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span>Other</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            {selectedDocuments.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{selectedDocuments.length} documents selected</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button size="sm" variant="outline">
                        <Move className="w-4 h-4 mr-2" />
                        Move
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
            {viewMode === "timeline" && renderTimelineView()}
            {viewMode === "kanban" && renderKanbanView()}

            {filteredDocuments.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No documents found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <Button onClick={() => setIsUploadDialogOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload your first document
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Document Details Dialog */}
        {selectedDocument && (
          <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {React.createElement(fileTypeIcons[selectedDocument.type], { className: "w-5 h-5" })}
                  {selectedDocument.name}
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="details" className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">File Size</Label>
                        <p className="text-sm text-gray-600">{formatFileSize(selectedDocument.size)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p className="text-sm text-gray-600">{selectedDocument.dateCreated.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Modified</Label>
                        <p className="text-sm text-gray-600">{selectedDocument.dateModified.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Author</Label>
                        <p className="text-sm text-gray-600">{selectedDocument.author}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <p className="text-sm text-gray-600">{selectedDocument.category}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Views</Label>
                        <p className="text-sm text-gray-600">{selectedDocument.viewCount}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Downloads</Label>
                        <p className="text-sm text-gray-600">{selectedDocument.downloadCount}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Version</Label>
                        <p className="text-sm text-gray-600">v{selectedDocument.version}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDocument.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedDocument.description && (
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-gray-600 mt-1">{selectedDocument.description}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="preview">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      {React.createElement(fileTypeIcons[selectedDocument.type], {
                        className: "w-16 h-16 text-gray-400 mx-auto mb-4",
                      })}
                      <p className="text-gray-500">Preview not available</p>
                      <Button className="mt-4">
                        <Eye className="w-4 h-4 mr-2" />
                        Open in External Viewer
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="ai-analysis">
                  {selectedDocument.aiProcessed ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">AI Analysis Complete</span>
                        <Badge variant="secondary">Score: {selectedDocument.aiScore}%</Badge>
                      </div>
                      {selectedDocument.aiSummary && (
                        <div>
                          <Label className="text-sm font-medium">Summary</Label>
                          <p className="text-sm text-gray-600 mt-1">{selectedDocument.aiSummary}</p>
                        </div>
                      )}
                      {selectedDocument.aiTags && (
                        <div>
                          <Label className="text-sm font-medium">AI-Generated Tags</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedDocument.aiTags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Reading Time</Label>
                          <p className="text-sm text-gray-600">{selectedDocument.readingTime} minutes</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Difficulty</Label>
                          <Badge className={difficultyColors[selectedDocument.difficulty || "intermediate"]}>
                            {selectedDocument.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">AI Analysis Not Available</h3>
                      <p className="text-sm text-gray-500 mb-4">This document hasn't been processed by AI yet</p>
                      <Button>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Process with AI
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="activity">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Document uploaded</p>
                        <p className="text-xs text-gray-500">{selectedDocument.dateCreated.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Last modified</p>
                        <p className="text-xs text-gray-500">{selectedDocument.dateModified.toLocaleString()}</p>
                      </div>
                    </div>
                    {selectedDocument.aiProcessed && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">AI processing completed</p>
                          <p className="text-xs text-gray-500">Score: {selectedDocument.aiScore}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
