import { SectionForm } from "@/components/sections/section-form"

export default function NewHomePageSection() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Add Homepage Section</h1>
      </div>

      <SectionForm />
    </div>
  )
} 