import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { MediaAsset } from "@/types/media"

interface MediaPreviewProps {
  asset: MediaAsset
  trigger?: React.ReactNode
}

export function MediaPreview({ asset, trigger }: MediaPreviewProps) {
  const isImage = asset.type === 'image'
  const isVideo = asset.type === 'video'
  const isAudio = asset.type === 'audio'
  const isPDF = asset.mimeType === 'application/pdf'

  // 获取下载链接
  const downloadUrl = `/api/media/download/${asset.id}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            Preview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{asset.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isImage && (
            <img
              src={asset.path}
              alt={asset.name}
              className="w-full rounded-lg"
            />
          )}

          {isVideo && (
            <video
              src={asset.path}
              controls
              className="w-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {isAudio && (
            <audio
              src={asset.path}
              controls
              className="w-full"
            >
              Your browser does not support the audio tag.
            </audio>
          )}

          {isPDF && (
            <iframe
              src={asset.path}
              className="w-full h-[70vh] rounded-lg"
            />
          )}

          {!isImage && !isVideo && !isAudio && !isPDF && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Preview not available for this file type.
                You can <a href={downloadUrl} className="text-primary hover:underline">download the file</a> to view it.
              </p>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>Type: {asset.type}</p>
              <p>Size: {(asset.size / 1024).toFixed(1)} KB</p>
              <p>Uploaded: {new Date(asset.createdAt).toLocaleDateString()}</p>
              <p>Downloads: {asset.downloads}</p>
            </div>
            <Button asChild>
              <a href={downloadUrl} download>
                Download
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 