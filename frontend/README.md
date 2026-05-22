# Comparador Textual

Uma aplicação web moderna e intuitiva para análise de similaridade e comparação detalhada entre documentos de texto.

## 🎯 Objetivo

O **Comparador Textual** foi desenvolvido para facilitar a identificação de coincidências e semelhanças entre dois arquivos. Seja para revisão de documentos, verificação de plágio ou análise de versões, a ferramenta fornece métricas precisas e uma visão granular dos trechos que mais se aproximam entre os textos comparados.

## ✨ Funcionalidades Principais

- **Upload de Documentos**: Interface simples para carregar dois arquivos para comparação simultânea.
- **Cálculo de Similaridade**: Exibição clara do percentual de similaridade textual global.
- **Análise de Frases**: Identificação e destaque de pares de frases similares entre os dois documentos, facilitando a localização de trechos copiados ou levemente alterados.
- **Extração de Termos Principais**: Levantamento das palavras-chave mais relevantes de cada arquivo (TF-IDF/Pesos), ajudando a entender o foco temático de cada texto.
- **Histórico de Sessão**: Registro local das comparações realizadas, permitindo consultar resultados anteriores rapidamente.
- **Interface Detalhada**: Modal de detalhes com visualização organizada por abas e suporte a temas (Light/Dark Mode).

## 🚀 Tecnologias Utilizadas

- **Frontend**: [Next.js](https://nextjs.org/) 15 (React, TypeScript)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Componentes**: Radix UI (Dialog, Tabs, ScrollArea, etc.)
- **Ícones**: Lucide React
- **Integração**: Fetch API para comunicação com backend de Processamento de Linguagem Natural (NLP).

## 🛠️ Como Executar

### Pré-requisitos
- Node.js instalado (v18 ou superior recomendado).
- Backend da API em execução (por padrão na porta 8000).

### Instalação e Execução
1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação em `http://localhost:3000`.

---
*Este projeto utiliza uma arquitetura moderna focada em performance e experiência do usuário (UX).*
