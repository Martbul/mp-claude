"use client"

import React from "react"

import {
  Star,
  Download,
  Share2,
  Eye,
  Trash2,
  Clock,
  MoreHorizontal,
  Brain,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { redirect } from "next/navigation"
import { DB_DocumentType } from "~/server/db/schema"
import { formatFileSize } from "../utils/utils"


type GridViewProps = {
  filteredDocuments: DB_DocumentType[];
  selectedDocuments: number[];
  deleteDocument: (documentId: number) => void;
  toggleStar: (documentId: number) => void;
}

const DocumentsGridView = ({
  filteredDocuments,
  selectedDocuments,
  deleteDocument,
  toggleStar,
}: GridViewProps) => {


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredDocuments.map((doc) => {
        const IconComponent = fileTypeIcons[doc.type]
        return (
          <Card
            key={doc.id}
            className={`group hover:shadow-lg transition-all cursor-pointer ${selectedDocuments.includes(doc.id) ? "ring-2 ring-blue-500" : ""
              }`}
            onClick={() => redirect(`/workspace/documents/${doc.id}`)}
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
                  <div className={`w-2 h-2 rounded-full ${documentStatusColors[doc.status]}`} />
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
                  <Badge className={`text-xs ${documentDifficultyColors[doc.difficulty]}`}>{doc.difficulty}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

}



export default DocumentsGridView;
