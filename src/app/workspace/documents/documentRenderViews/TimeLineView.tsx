import React from "react"
import { Card } from "~/components/ui/card"
import type { DB_DocumentType } from "~/server/db/schema"
import { formatFileSize } from "../utils/utils"
import { documentFileTypeIcons } from "~/app/_constants/constants"

type TimelineViewProps = {
  filteredDocuments: DB_DocumentType[];
}

const DocumentsTimelineView = ({
  filteredDocuments,
}: TimelineViewProps) => {
  return (
    <div className="space-y-6">
      {Object.entries(
        filteredDocuments.reduce(
          (acc, doc) => {
            const date = doc.dateModified.toDateString()
            if (!acc[date]) acc[date] = []
            acc[date].push(doc)
            return acc
          },
          {} as Record<string, DB_DocumentType[]>,
        ),
      ).map(([date, docs]) => (
        <div key={date} className="relative">
          <div className="sticky top-0 bg-white z-10 py-2 border-b">
            <h3 className="font-semibold text-lg">{date}</h3>
          </div>
          <div className="mt-4 space-y-2">
            {docs.map((doc) => {
              const IconComponent = documentFileTypeIcons[doc.type]
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
}

export default DocumentsTimelineView
