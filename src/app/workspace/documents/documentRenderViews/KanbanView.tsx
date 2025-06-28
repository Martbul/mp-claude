import React from "react"
import { Card } from "~/components/ui/card"
import { formatFileSize } from "../utils/utils"
import { Badge } from "lucide-react"
import type { DB_DocumentType } from "~/server/db/schema"
import { documentFileTypeIcons } from "~/app/_constants/constants"


type KanbanViewProps = {
  filteredDocuments: DB_DocumentType[];
}

const DocumentsKanbanView = ({
  filteredDocuments,
}: KanbanViewProps) => {


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
              const IconComponent = documentFileTypeIcons[doc.type]
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

export default DocumentsKanbanView;
