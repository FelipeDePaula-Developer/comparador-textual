"use client"

import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TextInputProps {
  textA: string
  textB: string
  onTextAChange: (value: string) => void
  onTextBChange: (value: string) => void
  onCompare: () => void
  isLoading: boolean
}

export function TextInput({
  textA,
  textB,
  onTextAChange,
  onTextBChange,
  onCompare,
  isLoading,
}: TextInputProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Texto 1
          <Textarea value={textA} onChange={(event) => onTextAChange(event.target.value)} placeholder="Cole o primeiro texto..." className="min-h-48 resize-y" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Texto 2
          <Textarea value={textB} onChange={(event) => onTextBChange(event.target.value)} placeholder="Cole o segundo texto..." className="min-h-48 resize-y" />
        </label>
      </div>
      <div className="flex justify-center">
        <Button size="lg" disabled={!textA.trim() || !textB.trim() || isLoading} onClick={onCompare} className="gap-2 px-12">
          {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />Comparando...</> : <>Comparar Textos<ArrowRight className="h-5 w-5" /></>}
        </Button>
      </div>
    </div>
  )
}
