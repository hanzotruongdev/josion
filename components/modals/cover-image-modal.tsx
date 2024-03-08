"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useCoverImage } from "@/hooks/use-cover-image"
import { useEdgeStore } from "@/lib/edgestore"
import { useMutation } from "convex/react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { SingleImageDropzone } from "../single-image-dropzone"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"

export const CoverImageModel = () => {
  const params = useParams()
  const update = useMutation(api.documents.update)
  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSumitting] = useState(false)
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()

  const onClose = () => {
    setFile(undefined)
    setIsSumitting(false)
    coverImage.onClose()
  }

  const onChange = async (file?: File) => {
    if (file) {
      setIsSumitting(true)
      setFile(file)

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url
        }
      })

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res?.url
      })

    }

    onClose()
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Cover
          </h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}