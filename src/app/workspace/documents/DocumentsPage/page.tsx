"use client"

import React from "react"

import { useState, useRef } from "react"
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
  Tag,
  Clock,
  Users,
  Move,
  SortAsc,
  SortDesc,
  BarChart3,
  Zap,
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  FolderIcon,
  CloudUpload,
  HardDrive,
  TrashIcon,
  Lock,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { DB_DocumentFolderType, DB_DocumentType } from "~/server/db/schema"
import type { DocumentSortBy, DocumentViewMode } from "~/app/_types/types"
import { formatFileSize } from "../utils/utils"
import DocumentsGridView from "../documentRenderViews/GridView"
import { COLOR_OPTIONS, documentDifficultyColors, documentFileTypeIcons } from "~/app/_constants/constants"
import { cn } from "~/lib/utils"
import { UploadDropzone } from "~/components/uploadthing"
import DocumentsKanbanView from "../documentRenderViews/KanbanView";
import DocumentsTimelineView from "../documentRenderViews/TimeLineView";
import DocumentsListView from "../documentRenderViews/ListView";
import { createDocumentAction, createDocumentFolderAction, deleteDocumentAction, deleteDocumentFolderAction } from "~/server/actions";

const categories = [
  'Academic', 'Business', 'Personal', 'Research', 'Legal', 'Medical',
  'Technical', 'Creative', 'Financial', 'Educational', 'Other'
]

const subjects = [
  'Mathematics', 'Science', 'Technology', 'Literature', 'History',
  'Business', 'Art', 'Music', 'Sports', 'Health', 'Finance', 'Other'
]

const difficulties = ['Beginner', 'Intermediate', 'Advanced']

export default function DocumentsPage(props: { documents: DB_DocumentType[], documentFolders: DB_DocumentFolderType[], userId: string }) {
  const [documents, setDocuments] = useState<DB_DocumentType[]>(Array.isArray(props.documents) ? props.documents : [])
  const [folders, setFolders] = useState<DB_DocumentFolderType[]>(Array.isArray(props.documentFolders) ? props.documentFolders : [])
  const [viewMode, setViewMode] = useState<DocumentViewMode>("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<DocumentSortBy>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedDocuments, setSelectedDocuments] = useState<DB_DocumentType[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DB_DocumentType | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<DB_DocumentFolderType | null>(null)
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState(COLOR_OPTIONS[0]);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "",
    size: 0,
    category: "Academic",
    url: "",
    tags: [] as string[],
    description: "",
    subject: "",
    difficulty: "Intermediate",
    isStarred: false,
    isShared: false,
    isLocked: false,
  });

  const updateUploadForm = (field: string, value: any) => {
    setNewDocument(prev => ({
      ...prev,
      [field]: value
    }));
  };
  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
      const matchesFolder = !selectedFolder || doc.folderId === selectedFolder.id
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

  const toggleDocumentSelection = (docId: number) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const toggleStar = (docId: number) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc)))
  }



  const categories = Array.from(new Set(documents.map((doc) => doc.category)))


  function getFileType(filename: string): string | null {
    if (!filename || typeof filename !== 'string') return null;

    const parts = filename.split('.');
    if (parts.length < 2) return null;

    return parts.pop()!.toLowerCase();
  }

  const handleCreateDocumentFolder = async () => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName) return;

    const optimisticFolder: Partial<DB_DocumentFolderType> = {
      id: Date.now(),
      name: trimmedName,
      color: newFolderColor ?? COLOR_OPTIONS[0]!,
      documentCount: 0,
      ownerId: props.userId,
    };

    // Optimistically update UI
    setFolders((prev) => [...prev, optimisticFolder]);

    setIsCreateFolderDialogOpen(false);
    try {
      const response = await createDocumentFolderAction(optimisticFolder);
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


  const handleDeleteDocumentFolder = async (folderId: number) => {
    const prevFolders = folders
    const prevSelectedDocuments = selectedDocuments;

    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (selectedFolder?.id === folderId) setSelectedFolder(null);

    setSelectedDocuments((prev) =>
      prev.filter((doc) => {
        const document = documents.find((d) => d.id === doc.id);
        return document?.folderId !== folderId;
      })
    );

    setDocuments((prev) => prev.filter((d) => d.folderId !== folderId));
    try {
      const result = await deleteDocumentFolderAction(props.userId, folderId);

      if (!result.success) {
        setFolders(prevFolders);
        setSelectedDocuments(prevSelectedDocuments)
        console.error("Failed to delete folder", result.error);
      }
    } catch (error) {
      setFolders(prevFolders);
      setSelectedDocuments(prevSelectedDocuments)
      console.error("Error deleting folder", error);
    }
  }


  const deleteDocument = async (documentId: number) => {
    const prevDocuments = documents;
    const prevSelectedDocuments = selectedDocuments;
    const deletedDoc = documents.find(d => d.id === documentId);
    const deletedDocumentFolderId = deletedDoc?.folderId;

    // Optimistic UI update
    setDocuments(prev => prev.filter(d => d.id !== documentId));
    setSelectedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    setSelectedDocument(null);

    // Optimistica folder doc couent decrement
    if (deletedDocumentFolderId) {
      setFolders(prev =>
        prev.map(folder =>
          folder.id === deletedDocumentFolderId
            ? { ...folder, documentCount: Math.max((folder.documentCount ?? 1) - 1, 0) }
            : folder
        )
      );
    }

    try {
      const result = await deleteDocumentAction(props.userId, documentId);

      if (!result.success) {
        setDocuments(prevDocuments);
        setSelectedDocuments(prevSelectedDocuments);

        if (deletedDocumentFolderId) {
          setFolders(prev =>
            prev.map(folder =>
              folder.id === deletedDocumentFolderId
                ? { ...folder, documentCount: (folder.documentCount ?? 0) + 1 }
                : folder
            )
          );
        }


        console.error("Failed to delete note", result.error);
      }
    } catch (error) {
      // Revert on exception
      setDocuments(prevDocuments);
      setSelectedDocuments(prevSelectedDocuments);

      if (deletedDocumentFolderId) {
        setFolders(prev =>
          prev.map(folder =>
            folder.id === deletedDocumentFolderId
              ? { ...folder, documentCount: (folder.documentCount ?? 0) + 1 }
              : folder
          )
        );
      }

      console.error("Error deleting note", error);
    }
  };

  //TODO: Set the newes forder to be result.data, so that the user do not need to refresh to access the now document


  const handleDocumentDBPersistance = async () => {
    const optimisticDocument: DB_DocumentType = {
      id: Date.now(),
      name: newDocument.name || "Untitled Document",
      type: newDocument.type,
      size: newDocument.size,
      ownerId: props.userId,
      url: newDocument.url || "",
      dateCreated: new Date(),
      dateModified: new Date(),
      tags: newDocument.tags || [],
      category: newDocument.category || "Uncategorized",
      isStarred: false,
      isShared: false,
      isLocked: false,
      thumbnail: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fdoc&psig=AOvVaw03MgAeyN8YUUp8me6WJclf&ust=1751385819668000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCP-eLCmY4DFQAAAAAdAAAAABAX",
      description: newDocument.description,
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
      difficulty: newDocument.difficulty,
      subject: newDocument.subject,
      folderId: selectedFolder ? selectedFolder.id : null,
    };

    const documentDataToSave = {
      name: newDocument.name,
      type: newDocument.type,
      size: newDocument.size,
      url: newDocument.url,
      tags: newDocument.tags,
      description: newDocument.description,
      category: newDocument.category,
      isStarred: newDocument.isStarred,
      isShared: newDocument.isShared,
      isLocked: newDocument.isLocked,
      difficulty: newDocument.difficulty,
      subject: newDocument.subject,
      folderId: selectedFolder ? selectedFolder.id : null,
      ownerId: props.userId,
    };

    setDocuments(prev => [...prev, optimisticDocument]);

    if (selectedFolder) {
      setFolders(prev =>
        prev.map(folder =>
          folder.id === selectedFolder.id
            ? { ...folder, documentCount: (folder.documentCount ?? 0) + 1 }
            : folder
        )
      );
    }

    setNewDocument({
      name: "",
      type: "",
      size: 0,
      url: "",
      tags: [],
      category: "Academic",
      description: "",
      difficulty: "Intermediate",
      subject: "",
      isStarred: false,
      isShared: false,
      isLocked: false,
    });


    setIsUploadDialogOpen(false);

    // Ensure proper return type
    type CreateDocumentResult =
      | { success: true; data: DB_DocumentType }
      | { success: false; error: string };

    try {
      const result = await createDocumentAction(documentDataToSave) as CreateDocumentResult;
      console.log(result);

      if (result.success && result.data) {
        setDocuments(prev =>
          prev.map(document =>
            document.id === optimisticDocument.id ? result.data : document
          )
        );
      } else {
        setDocuments(prev => prev.filter(document => document.id !== optimisticDocument.id));
        console.log("Failed to create document");
        setNewDocument({
          name: documentDataToSave.name,
          type: documentDataToSave.type,
          size: documentDataToSave.size,
          url: documentDataToSave.url,
          tags: documentDataToSave.tags,
          category: documentDataToSave.category,
          description: documentDataToSave.description,
          difficulty: documentDataToSave.difficulty,
          subject: documentDataToSave.subject,
          isStarred: documentDataToSave.isStarred,
          isShared: documentDataToSave.isShared,
          isLocked: documentDataToSave.isLocked,
        });

        // Roll back folder count
        if (selectedFolder) {
          setFolders(prev =>
            prev.map(folder =>
              folder.id === selectedFolder.id
                ? { ...folder, documentCount: Math.max((folder.documentCount ?? 1) - 1, 0) }
                : folder
            )
          );
        }
        setIsUploadDialogOpen(true);
      }
    } catch (error) {
      setDocuments(prev => prev.filter(document => document.id !== optimisticDocument.id));
      console.log("Failed to create document:", error);
      setNewDocument({
        name: documentDataToSave.name,
        type: documentDataToSave.type,
        size: documentDataToSave.size,
        url: documentDataToSave.url,
        tags: documentDataToSave.tags,
        category: documentDataToSave.category,
        description: documentDataToSave.description,
        difficulty: documentDataToSave.difficulty,
        subject: documentDataToSave.subject,
        isStarred: documentDataToSave.isStarred,
        isShared: documentDataToSave.isShared,
        isLocked: documentDataToSave.isLocked,
      });


      setIsUploadDialogOpen(true);
    }
  };


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
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
                  <DialogDescription>Upload files and configure their properties</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Files</Label>
                      <div
                        className="rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                      >
                        <UploadDropzone
                          endpoint="claudeUploader"
                          onClientUploadComplete={(res) => {
                            console.log("Upload response:", res);
                            if (!res || res.length === 0) {
                              console.error("No response data received");
                              return;
                            }
                            const uploadedFile = res[0];
                            if (uploadedFile) {

                              const fileType = getFileType(uploadedFile?.name);
                              updateUploadForm("name", uploadedFile?.name);
                              updateUploadForm("size", uploadedFile?.size);
                              updateUploadForm("type", fileType);
                              updateUploadForm("url", uploadedFile?.ufsUrl);
                            }
                          }}
                          onUploadError={(error) => {
                            console.error("❌ CLIENT: Upload error:", error);
                            console.error("❌ CLIENT: Error message:", error.message);
                            console.error("❌ CLIENT: Error stack:", error.stack);
                          }}
                          onUploadBegin={(name) => {
                            console.log("🚀 CLIENT: Upload started for:", name);
                          }}
                          onUploadProgress={(progress) => {
                            console.log("📊 CLIENT: Upload progress:", progress + "%");
                          }}
                          onBeforeUploadBegin={(files) => {
                            console.log("⏳ CLIENT: Before upload begin:", files);
                            return files;
                          }}
                          appearance={{
                            container: {
                              border: "2px dashed #ccc",
                              borderRadius: "8px",
                              padding: "20px",
                              minHeight: "200px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer"
                            }
                          }}
                          config={{
                            mode: "auto"
                          }}
                        />

                      </div>


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

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Destination Folder</Label>
                      <Select
                        value={selectedFolder?.id?.toString() || "none"}
                        onValueChange={(value) => setSelectedFolder(value === "none" ? null : folders.find(f => f.id.toString() === value) || null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select folder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            <div className="flex items-center gap-2">
                              <FolderIcon className="w-4 h-4" />
                              No Folder (Root)
                            </div>
                          </SelectItem>
                          {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id.toString()}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded"
                                  style={{ backgroundColor: folder.color }}
                                />
                                {folder.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select
                        value={newDocument.category}
                        onValueChange={(value) => updateUploadForm("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Subject</Label>
                      <Select
                        value={newDocument.subject}
                        onValueChange={(value) => updateUploadForm("subject", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Difficulty Level</Label>
                      <Select
                        value={newDocument.difficulty}
                        onValueChange={(value) => updateUploadForm("difficulty", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map((difficulty) => (
                            <SelectItem key={difficulty} value={difficulty}>
                              <Badge className={documentDifficultyColors[difficulty.toLowerCase() as keyof typeof documentDifficultyColors]}>
                                {difficulty}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <textarea
                        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a description for your documents..."
                        value={newDocument.description}
                        onChange={(e) => updateUploadForm("description", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tag and press Enter"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newTag.trim()) {
                              e.preventDefault();
                              if (!newDocument.tags.includes(newTag.trim())) {
                                updateUploadForm("tags", [...newDocument.tags, newTag.trim()]);
                              }
                              setNewTag("");
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (newTag.trim() && !newDocument.tags.includes(newTag.trim())) {
                              updateUploadForm("tags", [...newDocument.tags, newTag.trim()]);
                              setNewTag("");
                            }
                          }}
                        >
                          <Tag className="w-4 h-4" />
                        </Button>
                      </div>

                      {newDocument.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {newDocument.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer">
                              {tag}
                              <button
                                onClick={() => {
                                  updateUploadForm("tags", newDocument.tags.filter((_, i) => i !== index));
                                }}
                                className="ml-1 text-gray-500 hover:text-gray-700"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Document Options</Label>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="starred"
                          checked={newDocument.isStarred}
                          onChange={(e) => updateUploadForm("isStarred", e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="starred" className="text-sm flex items-center gap-2 cursor-pointer">
                          <Star className="w-4 h-4" />
                          Star these documents
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="shared"
                          checked={newDocument.isShared}
                          onChange={(e) => updateUploadForm("isShared", e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="shared" className="text-sm flex items-center gap-2 cursor-pointer">
                          <Share2 className="w-4 h-4" />
                          Make shareable
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="locked"
                          checked={newDocument.isLocked}
                          onChange={(e) => updateUploadForm("isLocked", e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="locked" className="text-sm flex items-center gap-2 cursor-pointer">
                          <Lock className="w-4 h-4" />
                          Lock from editing
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsUploadDialogOpen(false);
                      setNewDocument({
                        name: "",
                        type: "",
                        size: 0,
                        url: "",
                        tags: [],
                        category: "Academic",
                        description: "",
                        difficulty: "Intermediate",
                        subject: "",
                        isStarred: false,
                        isShared: false,
                        isLocked: false,
                      });
                      setNewTag("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleDocumentDBPersistance()
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <CloudUpload className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


          </div>
        </div>

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
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as DocumentSortBy)}>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-4">


            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg">Folders</CardTitle>
                <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">+ Add</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                    </DialogHeader>

                    <Input
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="mb-4"
                    />

                    <div className="space-y-1">
                      <div className="text-sm font-medium">Choose color</div>
                      <div className="flex gap-2 mt-1">
                        {COLOR_OPTIONS.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewFolderColor(color)}
                            className={cn(
                              "w-6 h-6 rounded-full border-2",
                              color === newFolderColor ? "border-black" : "border-transparent"
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button onClick={handleCreateDocumentFolder}
                        disabled={!newFolderName.trim()}
                      >Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedFolder === null ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFolder(null)}
                  >
                    <FolderIcon className="w-4 h-4 mr-2" />
                    All Documents
                    <Badge variant="secondary" className="ml-auto">{documents.length}</Badge>
                  </Button>

                  {folders.map((folder) => (
                    <div key={folder.id} className="flex items-center space-x-2">
                      <Button
                        variant={selectedFolder?.id === folder.id ? "default" : "ghost"}
                        className="flex-1 justify-start"
                        onClick={() => setSelectedFolder(folder)}
                      >
                        <div
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: folder.color }}
                        />
                        {folder.name}
                        <Badge variant="secondary" className="ml-auto">
                          {folder.documentCount}
                        </Badge>
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <TrashIcon className="w-4 h-4 text-black-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Folder?</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-muted-foreground">
                            This will permanently remove the folder and its notes.
                          </p>
                          <DialogFooter className="mt-4">
                            <Button variant="outline" >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteDocumentFolder(folder.id)}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
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

            {viewMode === "grid" && <DocumentsGridView filteredDocuments={filteredDocuments} selectedDocuments={selectedDocuments} deleteDocument={deleteDocument} toggleStar={toggleStar} />}
            {viewMode === "list" && <DocumentsListView filteredDocuments={filteredDocuments} selectedDocuments={selectedDocuments} toggleDocumentSelection={toggleDocumentSelection} />}
            {viewMode === "timeline" && <DocumentsTimelineView filteredDocuments={filteredDocuments} />}
            {viewMode === "kanban" && <DocumentsKanbanView filteredDocuments={filteredDocuments} />}

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
                  {React.createElement(documentFileTypeIcons[selectedDocument.type], { className: "w-5 h-5" })}
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
                      {React.createElement(documentFileTypeIcons[selectedDocument.type], {
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
                          <Badge className={documentDifficultyColors[selectedDocument.difficulty || "intermediate"]}>
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
