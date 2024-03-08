"use client"

import "@blocknote/core/fonts/inter.css";

import {
  BlockNoteEditor, PartialBlock
} from "@blocknote/core";

import {
  BlockNoteView,
  useCreateBlockNote
} from "@blocknote/react";

import "@blocknote/react/style.css";

import { useTheme } from "next-themes";

export const Editor = (
  {
    initialContent,
    onChange
  }: {
    onChange: (value: string) => void,
    initialContent?: string,
    editable?: boolean,
  }
) => {

  const { resolvedTheme } = useTheme()
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined
  })

  return (
    <div>
      <BlockNoteView editor={editor}

        onChange={async () => onChange(JSON.stringify(editor.document))}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}