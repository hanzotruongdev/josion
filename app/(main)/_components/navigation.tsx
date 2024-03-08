"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { api } from "@/convex/_generated/api"
import { useSearch } from "@/hooks/use-search"
import { useSetting } from "@/hooks/use-settings"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react"
import { useParams, usePathname } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useMediaQuery } from "usehooks-ts"
import DocumentList from "./document-list"
import Item from "./item"
import Navbar from "./navbar"
import TrashBox from "./trash-box"
import UserItem from "./user-item"

export default function Navigation() {
  const settings = useSetting()
  const search = useSearch()
  const params = useParams()
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const documents = useQuery(api.documents.get)
  const create = useMutation(api.documents.create)

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<"aside">>(null)
  const navbarRef = useRef<ElementRef<"div">>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWith()
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  const handleMouseUp = (event: any) => {
    isResizingRef.current = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (event: any) => {
    if (!isResizingRef.current) return

    let newWidth = event.clientX

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty("left", `${newWidth}px`)
      navbarRef.current.style.setProperty("width", `calc(100%-${newWidth}px)`)
    }
  }

  const handleMouseDown = (even: any) => {
    event?.preventDefault()
    event?.stopPropagation()

    isResizingRef.current = true
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const resetWith = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? "100%" : "240px"
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      )
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "240px"
      );

      setTimeout(() => {
        setIsResetting(false)
      }, 300);
    }
  }

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = "0"
      navbarRef.current.style.setProperty("width", "100%")
      navbarRef.current.style.setProperty("left", "0")

      setTimeout(() => {
        setIsResetting(false)
      }, 300);
    }
  }

  const handleCreate = () => {
    const promise = create({ title: "Untitled" })

    toast.promise(promise, {
      loading: "Create a new note...",
      success: "New note created!",
      error: "Fail to create a new note."
    })
  }


  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar bg-secondary overflow-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}>
        <div
          onClick={collapse}
          role="button"
          className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />

          <Item
            onClick={search.onOpen}
            label="Search"
            icon={Search}
            isSearch
          />
          <Item
            onClick={settings.onOpen}
            label="Setting"
            icon={Settings}
          />
          <Item
            onClick={handleCreate}
            label="New page"
            icon={PlusCircle}

          />
        </div>
        <div className="mt-4">
          <DocumentList level={0} />
          <Item onClick={handleCreate} label={"Add a page"} icon={Plus} />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="p-0 w-72">
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWith}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 right-0 top-0"
        >
        </div>
      </aside>
      <div ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}>
        {
          params.documentId ? (
            <Navbar
              isCollapsed={isCollapsed}
              onResetWidth={resetWith}

            />
          ) :
            <nav className="bg-transparent px-3 py-2 w-full">
              {isCollapsed && <MenuIcon onClick={resetWith} role="button" className="h-6 w-6 text-muted-foreground" />}
            </nav>
        }
      </div >
    </>
  )
}