"use client"

import { useEffect, useState } from "react"
import { CoverImageModel } from "../modals/cover-image-modal"
import SettingsModal from "../modals/settings-modal"

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <SettingsModal />
      <CoverImageModel />
    </>
  )
}