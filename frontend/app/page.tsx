"use client"

import { useState, useCallback } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { FileUploadZone } from "@/components/file-upload-zone"
import { TextInput } from "@/components/text-input"
import { SimilarityResult } from "@/components/similarity-result"
import {
  ComparisonHistory,
  type ComparisonRecord,
} from "@/components/comparison-history"
import { DetailsDialog } from "@/components/details-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [similarityDecimal, setSimilarityDecimal] = useState<number | null>(null)
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null)
  const [textA, setTextA] = useState("")
  const [textB, setTextB] = useState("")
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
    setSimilarityDecimal(null)
    setProcessingTimeMs(null)
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
      setSimilarityDecimal(data.similarity_0_1 ?? null)
      setProcessingTimeMs(data.processing_time_ms ?? null)

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

  const handleCompareTexts = useCallback(async () => {
    if (!textA.trim() || !textB.trim()) return
    setIsLoading(true)
    setSimilarity(null)
    setSimilarityDecimal(null)
    setProcessingTimeMs(null)
    setCurrentRecord(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
      const response = await fetch(`${apiUrl}/compare/texts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text_a: textA, text_b: textB }),
      })
      if (!response.ok) throw new Error("Erro ao comparar textos")
      const data = await response.json()
      setSimilarity(data.similarity_percent)
      setSimilarityDecimal(data.similarity_0_1 ?? null)
      setProcessingTimeMs(data.processing_time_ms ?? null)
      const newRecord: ComparisonRecord = {
        id: Date.now().toString(), file1Name: "Texto 1", file2Name: "Texto 2",
        percentage: data.similarity_percent, date: new Date(),
        top_terms_a: data.top_terms_a, top_terms_b: data.top_terms_b,
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
  }, [textA, textB])

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
          <section>
            <Tabs defaultValue="upload">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="upload">Enviar arquivos</TabsTrigger>
                <TabsTrigger value="text">Colar textos</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <div className="grid gap-6 md:grid-cols-2">
                  <FileUploadZone label="Arquivo 1" file={file1} onFileSelect={setFile1} />
                  <FileUploadZone label="Arquivo 2" file={file2} onFileSelect={setFile2} />
                </div>
                <div className="mt-8 flex justify-center">
                  <Button
                    size="lg"
                    disabled={!canCompare}
                    onClick={handleCompare}
                    className="gap-2 px-12 min-w-[280px] h-14 text-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                  >
                    {isLoading ? <><Loader2 className="h-6 w-6 animate-spin" />Comparando...</> : <>Comparar Arquivos<ArrowRight className="h-6 w-6" /></>}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="text">
                <TextInput textA={textA} textB={textB} onTextAChange={setTextA} onTextBChange={setTextB} onCompare={handleCompareTexts} isLoading={isLoading} />
              </TabsContent>
            </Tabs>

          </section>

          {/* Resultado */}
          <section>
            <SimilarityResult
              percentage={similarity}
              decimal={similarityDecimal}
              processingTimeMs={processingTimeMs}
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
