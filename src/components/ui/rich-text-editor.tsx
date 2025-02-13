'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { Button } from './button'
import { Code } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Textarea } from './textarea'

const QuillNoSSR = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

// Quill 编辑器配置
const editorModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ],
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [sourceCode, setSourceCode] = React.useState(value)

  // 当值改变时更新源代码
  React.useEffect(() => {
    setSourceCode(value)
  }, [value])

  // 处理源代码更改
  const handleSourceCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceCode(e.target.value)
  }

  // 应用源代码更改
  const handleApplySourceCode = () => {
    onChange(sourceCode)
    setIsEditing(false)
  }

  return (
    <div className="relative min-h-[200px]">
      <QuillNoSSR
        value={value}
        onChange={onChange}
        modules={editorModules}
        className={className}
      />
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 z-10"
            title="Edit HTML Source"
          >
            <Code className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit HTML Source</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={sourceCode}
              onChange={handleSourceCodeChange}
              className="min-h-[400px] font-mono"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplySourceCode}>
                Apply Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 