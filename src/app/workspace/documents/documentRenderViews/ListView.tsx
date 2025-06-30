import React from "react"
import {
  Star,
  Eye,
  Users,
  Lock,
  Brain,
} from "lucide-react"

import { Card } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Checkbox } from "~/components/ui/checkbox"
import { redirect } from "next/navigation"
import { formatFileSize } from "../utils/utils"
import { documentFileTypeIcons, documentStatusColors } from "~/app/_constants/constants"
import type { DB_DocumentType } from "~/server/db/schema"


type ListViewProps = {
  filteredDocuments: DB_DocumentType[];
  selectedDocuments: DB_DocumentType[];
  toggleDocumentSelection: (documentId: number) => void;
}

const DocumentsListView = ({
  filteredDocuments,
  selectedDocuments,
  toggleDocumentSelection,
}: ListViewProps) => {

  <div className="space-y-2">
    {filteredDocuments.map((doc) => {
      const IconComponent = documentFileTypeIcons[doc.type]
      return (
        <Card
          key={doc.id}
          className={`p-4 hover:shadow-md transition-all cursor-pointer ${selectedDocuments.includes(doc.id) ? "ring-2 ring-blue-500" : ""
            }`}
          onClick={() => redirect(`/workspace/documents/${doc.id}`)}
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
              <div className={`w-2 h-2 rounded-full ${documentStatusColors[doc.status]}`} />
            </div>
          </div>
        </Card>
      )
    })}
  </div>
}

export default DocumentsListView
