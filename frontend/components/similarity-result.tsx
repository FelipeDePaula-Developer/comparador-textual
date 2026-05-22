"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimilarityResultProps {
  percentage: number | null
  isLoading?: boolean
  onViewDetails?: () => void
}

function getSimilarityLevel(percentage: number): {
  label: string
  color: string
  bgColor: string
} {
  if (percentage < 30) {
    return {
      label: "Similaridade baixa",
      color: "text-success",
      bgColor: "bg-success/10",
    }
  }
  if (percentage < 70) {
    return {
      label: "Similaridade moderada",
      color: "text-warning",
      bgColor: "bg-warning/10",
    }
  }
  return {
    label: "Similaridade alta",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  }
}

export function SimilarityResult({
  percentage,
  isLoading = false,
  onViewDetails,
}: SimilarityResultProps) {
  const similarityLevel = percentage !== null ? getSimilarityLevel(percentage) : null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-xl">Resultado da Comparação</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-10 pb-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full animate-spin" viewBox="0 0 100 100">
                <circle
                  className="stroke-muted"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                />
                <circle
                  className="stroke-primary"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                  strokeDasharray="66 198"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">Analisando arquivos...</p>
          </div>
        ) : percentage !== null && similarityLevel ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="stroke-muted"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                />
                <circle
                  className={cn(
                    "transition-all duration-1000 ease-out",
                    percentage < 30
                      ? "stroke-success"
                      : percentage < 70
                        ? "stroke-warning"
                        : "stroke-destructive"
                  )}
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                  strokeDasharray={`${(percentage / 100) * 264} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">
                  {percentage}%
                </span>
              </div>
            </div>
            <div
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium",
                similarityLevel.bgColor,
                similarityLevel.color
              )}
            >
              {similarityLevel.label}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="stroke-muted"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">--%</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Selecione dois arquivos e clique em comparar
            </p>
          </div>
        )}
      </CardContent>
      {percentage !== null && !isLoading && (
        <CardFooter className="flex justify-center border-t bg-muted/10 py-4">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="gap-2 transition-all hover:bg-primary/5 hover:text-primary"
          >
            <Eye className="h-4 w-4" />
            Ver detalhes da comparação
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
