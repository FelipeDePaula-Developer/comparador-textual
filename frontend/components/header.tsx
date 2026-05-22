import { FileSearch } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-8 text-center md:py-12">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2">
            <FileSearch className="h-6 w-6 text-primary-foreground md:h-8 md:w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
            Sistema de Comparação de Conteúdo Textual
          </h1>
        </div>
        <p className="max-w-2xl text-pretty text-muted-foreground md:text-lg">
          Envie dois arquivos para calcular o percentual de similaridade entre seus
          conteúdos de forma rápida e precisa.
        </p>
      </div>
    </header>
  )
}
