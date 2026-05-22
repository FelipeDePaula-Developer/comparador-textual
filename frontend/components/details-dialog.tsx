"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Calendar, Percent, List, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ComparisonRecord } from "./comparison-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface DetailsDialogProps {
  record: ComparisonRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getSimilarityInfo(percentage: number) {
  if (percentage < 30) {
    return {
      label: "Similaridade baixa",
      description:
        "Os arquivos possuem conteúdos predominantemente diferentes, indicando pouca coincidência textual.",
      color: "text-success",
      bgColor: "bg-success/10",
    }
  }
  if (percentage < 70) {
    return {
      label: "Similaridade moderada",
      description:
        "Os arquivos apresentam trechos em comum, mas também possuem diferenças significativas no conteúdo.",
      color: "text-warning",
      bgColor: "bg-warning/10",
    }
  }
  return {
    label: "Similaridade alta",
    description:
      "Os arquivos possuem grande parte do conteúdo em comum, indicando alto grau de coincidência textual.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  }
}

export function DetailsDialog({
  record,
  open,
  onOpenChange,
}: DetailsDialogProps) {
  if (!record) return null

  const similarityInfo = getSimilarityInfo(record.percentage)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Detalhes da Comparação</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-8">
            <div className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full",
                  similarityInfo.bgColor
                )}
              >
                <span className={cn("text-3xl font-bold", similarityInfo.color)}>
                  {record.percentage}%
                </span>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium",
                  similarityInfo.bgColor,
                  similarityInfo.color
                )}
              >
                {similarityInfo.label}
              </span>
              <p className="text-center text-sm text-muted-foreground">
                {similarityInfo.description}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Arquivo 1</p>
                    <p className="font-medium truncate max-w-[200px]">{record.file1Name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Arquivo 2</p>
                    <p className="font-medium truncate max-w-[200px]">{record.file2Name}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data da comparação</p>
                    <p className="font-medium">
                      {record.date.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Percent className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Percentual de similaridade
                    </p>
                    <p className="font-medium">{record.percentage}%</p>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="sentences" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sentences" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Frases Similares
                </TabsTrigger>
                <TabsTrigger value="terms" className="gap-2">
                  <List className="h-4 w-4" />
                  Termos Principais
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sentences" className="mt-4 space-y-4">
                {record.top_sentence_pairs && record.top_sentence_pairs.length > 0 ? (
                  record.top_sentence_pairs.map((pair, idx) => (
                    <div key={idx} className="rounded-md border p-4 space-y-3 bg-card">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{pair.score_percent.toFixed(1)}% similar</Badge>
                      </div>
                      <div className="grid gap-3 text-sm md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Arquivo A</p>
                          <p className="italic">"{pair.sent_a}"</p>
                        </div>
                        <div className="space-y-1 border-t pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Arquivo B</p>
                          <p className="italic">"{pair.sent_b}"</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-8">Nenhuma frase similar relevante encontrada.</p>
                )}
              </TabsContent>

              <TabsContent value="terms" className="mt-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-sm">A</Badge> Termos de {record.file1Name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {record.top_terms_a?.map((t, idx) => (
                        <Badge key={idx} variant="outline" className="font-normal">
                          {t.term} <span className="ml-1 text-[10px] text-muted-foreground">({t.weight.toFixed(3)})</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-sm">B</Badge> Termos de {record.file2Name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {record.top_terms_b?.map((t, idx) => (
                        <Badge key={idx} variant="outline" className="font-normal">
                          {t.term} <span className="ml-1 text-[10px] text-muted-foreground">({t.weight.toFixed(3)})</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
