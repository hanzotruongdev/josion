"use client"

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { FileIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Item from "./item"

export default function DocumentList({
  parentDocumentId,
  level = 0,
  data
}: {
  parentDocumentId?: Id<"documents">,
  level?: number,
  data?: Doc<"documents">[]
}) {
  const params = useParams()
  const router = useRouter()
  const [expaned, setExpaned] = useState<Record<string, boolean>>({})

  const onExpand = (documentId: string) => {
    setExpaned(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }))
  }

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId
  })

  const onRedirect = (documnetId: string) => {
    router.push(`/documents/${documnetId}`)
  }

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expaned && "last:block",
          level === 0 && "hidden"
        )}
      >

        No Pages inside
      </p>

      {documents.map((doc) => (
        <div key={doc._id}>
          <Item
            id={doc._id}
            label={doc.title}
            onClick={() => onRedirect(doc._id)}
            icon={FileIcon}
            documentIcon={doc.icon}
            active={params.documentId === doc._id}
            level={level}
            onExpand={() => onExpand(doc._id)}
            expanded={expaned[doc._id]}
          />
          {
            expaned[doc._id] && (
              <DocumentList
                parentDocumentId={doc._id}
                level={level + 1}
              />
            )
          }
        </div>
      ))


      }
    </>
  )


}