"use client"

import { Eye, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ComparisonRecord {
  id: string
  file1Name: string
  file2Name: string
  percentage: number
  date: Date
  top_terms_a?: { term: string; weight: number }[]
  top_terms_b?: { term: string; weight: number }[]
  top_sentence_pairs?: {
    score_percent: number
    sent_a: string
    sent_b: string
  }[]
}

interface ComparisonHistoryProps {
  records: ComparisonRecord[]
  onViewDetails: (record: ComparisonRecord) => void
}

function getSimilarityBadge(percentage: number) {
  if (percentage < 30) {
    return {
      label: "Baixa",
      className: "bg-success/10 text-success",
    }
  }
  if (percentage < 70) {
    return {
      label: "Moderada",
      className: "bg-warning/10 text-warning",
    }
  }
  return {
    label: "Alta",
    className: "bg-destructive/10 text-destructive",
  }
}

export function ComparisonHistory({
  records,
  onViewDetails,
}: ComparisonHistoryProps) {
  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-xl">Comparações Anteriores</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Nenhuma comparação realizada ainda
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {records.map((record) => {
              const badge = getSimilarityBadge(record.percentage)
              return (
                <div
                  key={record.id}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{record.file1Name}</span>
                    </div>
                    <span className="hidden text-muted-foreground sm:inline">vs</span>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{record.file2Name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">
                        {record.percentage}%
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          badge.className
                        )}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <span className="hidden text-sm text-muted-foreground md:inline">
                      {record.date.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(record)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Detalhes</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
