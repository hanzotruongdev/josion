"use client"

import { useSetting } from "@/hooks/use-settings"
import { Label } from "@radix-ui/react-label"
import { ModeToggle } from "../mode-toggle"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"

export default function SettingsModal() {
  const settings = useSetting()

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">
            My settings
          </h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gay-y-1">
            <Label>
              Appearance
            </Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Josion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}