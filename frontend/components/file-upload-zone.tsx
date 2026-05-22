"use client"

import { useCallback, useState } from "react"
import { FileText, Upload, X, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  label: string
  file: File | null
  onFileSelect: (file: File | null) => void
  acceptedFormats?: string
}

export function FileUploadZone({
  label,
  file,
  onFileSelect,
  acceptedFormats = ".txt,.pdf",
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        onFileSelect(selectedFile)
        e.target.value = ""
      }
    },
    [onFileSelect]
  )

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFileSelect(null)
  }, [onFileSelect])

  return (
    <Card
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 p-8 transition-all duration-200 cursor-pointer",
        "border-2 border-dashed min-h-[200px]",
        (isDragging || file)
          ? "border-primary bg-primary/5 ring-2 ring-primary/20 ring-offset-2"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !file && document.getElementById(`file-input-${label}`)?.click()}
    >
      <input
        id={`file-input-${label}`}
        type="file"
        className="hidden"
        accept={acceptedFormats}
        onChange={handleFileChange}
      />
      
      <div className="text-center flex flex-col items-center">
        <span className={cn(
          "mb-4 inline-block rounded-full p-4 transition-colors",
          file ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
        )}>
          {file ? (
            <FileText className="h-10 w-10" />
          ) : (
            <Upload className="h-10 w-10" />
          )}
        </span>
        
        <h3 className={cn(
          "text-lg font-bold transition-all",
          file ? "text-primary" : "text-foreground"
        )}>
          {file ? file.name : label}
        </h3>

        {file ? (
          <div className="mt-4 flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(`file-input-${label}`)?.click();
              }}
            >
              <RefreshCw className="h-3 w-3" />
              Trocar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 h-8"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
              Remover
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Arraste seu arquivo ou clique para selecionar
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60 italic">
              Formatos aceitos: .txt, .pdf
            </p>
          </>
        )}
      </div>
    </Card>
  )
}
