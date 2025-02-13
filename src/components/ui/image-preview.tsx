'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  src: string
  alt: string
  children: React.ReactNode
}

// Custom DialogContent without default close button
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-screen-lg translate-x-[-50%] translate-y-[-50%] p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] bg-black/90",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

export function ImagePreview({ src, alt, children }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20">
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <div className="relative">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-contain max-h-[80vh]"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 