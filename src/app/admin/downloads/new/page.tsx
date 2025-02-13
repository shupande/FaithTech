import { DownloadForm } from "@/components/downloads/download-form"

export default function NewDownloadPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Add Download</h1>
      </div>

      <DownloadForm />
    </div>
  )
} 