"use client"

import { useState, useCallback } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { FileUploadZone } from "@/components/file-upload-zone"
import { SimilarityResult } from "@/components/similarity-result"
import {
  ComparisonHistory,
  type ComparisonRecord,
} from "@/components/comparison-history"
import { DetailsDialog } from "@/components/details-dialog"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [currentRecord, setCurrentRecord] = useState<ComparisonRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<ComparisonRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<ComparisonRecord | null>(
    null
  )
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCompare = useCallback(async () => {
    if (!file1 || !file2) return

    setIsLoading(true)
    setSimilarity(null)
    setCurrentRecord(null)

    try {
      const formData = new FormData()
      formData.append("file_a", file1)
      formData.append("file_b", file2)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
      const response = await fetch(`${apiUrl}/compare`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erro ao comparar arquivos")
      }

      const data = await response.json()
      const percentage = data.similarity_percent

      setSimilarity(percentage)

      const newRecord: ComparisonRecord = {
        id: Date.now().toString(),
        file1Name: file1.name,
        file2Name: file2.name,
        percentage: percentage,
        date: new Date(),
        top_terms_a: data.top_terms_a,
        top_terms_b: data.top_terms_b,
        top_sentence_pairs: data.top_sentence_pairs,
      }

      setCurrentRecord(newRecord)
      setHistory((prev) => [newRecord, ...prev])
    } catch (error) {
      console.error("Comparison error:", error)
      alert("Ocorreu um erro ao processar a comparação. Verifique se o backend está ativo.")
    } finally {
      setIsLoading(false)
    }
  }, [file1, file2])

  const handleViewDetails = useCallback((record: ComparisonRecord) => {
    setSelectedRecord(record)
    setDialogOpen(true)
  }, [])

  const canCompare = file1 !== null && file2 !== null && !isLoading

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Seção de Upload */}
          <section>
            <div className="grid gap-6 md:grid-cols-2">
              <FileUploadZone
                label="Arquivo 1"
                file={file1}
                onFileSelect={setFile1}
              />
              <FileUploadZone
                label="Arquivo 2"
                file={file2}
                onFileSelect={setFile2}
              />
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                disabled={!canCompare}
                onClick={handleCompare}
                className="gap-2 px-12 min-w-[280px] h-14 text-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Comparando...
                  </>
                ) : (
                  <>
                    Comparar Arquivos
                    <ArrowRight className="h-6 w-6" />
                  </>
                )}
              </Button>
            </div>
          </section>

          {/* Resultado */}
          <section>
            <SimilarityResult
              percentage={similarity}
              isLoading={isLoading}
              onViewDetails={() => currentRecord && handleViewDetails(currentRecord)}
            />
          </section>

          {/* Histórico */}
          <section>
            <ComparisonHistory
              records={history}
              onViewDetails={handleViewDetails}
            />
          </section>
        </div>
      </main>

      <DetailsDialog
        record={selectedRecord}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
