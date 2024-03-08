"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Item({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded

}: {
  id?: Id<"documents">
  documentIcon?: string,
  active?: boolean,
  expanded?: boolean,
  isSearch?: boolean,
  level?: number,
  onExpand?: () => void,
  label: string,
  onClick?: (v: any) => void,
  icon: LucideIcon
}) {
  const { user } = useUser()
  const router = useRouter()
  const create = useMutation(api.documents.create)
  const archive = useMutation(api.documents.archive)

  const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!id) return
    const promise = archive({ id })

    toast.promise(promise, {
      loading: "Archiving note...",
      success: "Note achived!",
      error: "Fail to archive."
    })
  }

  const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    onExpand?.()
  }


  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!id) return

    const promise = create({ title: 'Untitled', parentDocument: id })
      .then((documentId) => {
        if (!expanded) {
          onExpand?.()
        }

        // router.push(`/documents/${documentId}`)
      })

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Fail to create a new note.",
    })
  }

  const ChevronIcon = expanded ? ChevronDown : ChevronRight



  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1 "
          onClick={handleExpand}
        >
          <ChevronIcon
            className="h-4 w-4 shrink-0 text-muted-foreground/50"
          />
        </div>
      )}
      {documentIcon && (
        <div className="shrink-0 mr-2 text-[18px]">
          {documentIcon}
        </div>
      )}
      <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" >
      </Icon>
      <span className="truncate">
        {label}
      </span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px\ font-medium text-muted-foreground opacity-100">
          <span className="text-xs">
            ⌘
          </span>K
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu >
            <DropdownMenuTrigger asChild
              onClick={(e) => e.stopPropagation()}
            >
              <div role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal></MoreHorizontal>
              </div>

            </DropdownMenuTrigger>

            <DropdownMenuContent

              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem
                onClick={onArchive}
              >
                <Trash className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-mute-foreground p-2">
                Last editted by: {user?.fullName}
              </div>
            </DropdownMenuContent>

          </DropdownMenu>
          <div
            onClick={onCreate}
            role="button"
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>

        </div>
      )

      }
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px'
      }}
      className="flex gap-x-2 py-[3px"
    >
      <Skeleton className="h-4 w-4 "></Skeleton>
      <Skeleton className="h-4 w-[30%] "></Skeleton>
    </div>
  )
}