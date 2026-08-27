# Comparador Textual (TF-IDF + Cosseno)

Este projeto tem como objetivo analisar e comparar a similaridade entre dois textos, utilizando técnicas de Processamento de Linguagem Natural (PLN). Ele identifica o quão próximos dois documentos estão um do outro, destacando termos relevantes e sentenças que servem como evidência de similaridade.

## 🚀 Objetivo

O sistema foi desenvolvido para fornecer uma métrica quantitativa e qualitativa de comparação textual, sendo útil para:
- Detecção de similaridade entre documentos.
- Análise de termos principais em diferentes textos.
- Extração de evidências (pares de sentenças) que comprovam a semelhança.

## 🛠️ Tecnologias e Algoritmos

- **Python 3.10+**: Linguagem base.
- **TF-IDF (Term Frequency-Inverse Document Frequency)**: Utilizado para converter o texto em vetores numéricos, dando peso aos termos mais importantes.
- **Similaridade de Cosseno**: Algoritmo que calcula o ângulo entre os vetores de texto para determinar o grau de similaridade (de 0 a 100%).
- **Scikit-learn**: Biblioteca principal para vetorização e cálculo de métricas.
- **FastAPI**: Framework para a disponibilização de uma API robusta.
- **PyPDF**: Utilizado para extração de texto de arquivos PDF.

## 📦 Funcionalidades

- **Normalização de Texto**: Conversão para minúsculas, limpeza de caracteres invisíveis e colapso de espaços. Os caracteres acentuados do português são preservados.
- **Suporte a Arquivos**: Processa arquivos de texto puro (`.txt`) e documentos em `.pdf`.
- **Texto colado**: Permite enviar dois textos diretamente para comparação, sem remover o upload.
- **Interface CLI**: Ferramenta de linha de comando para execuções rápidas.
- **API Web**: Endpoint REST para integração com frontends ou outros sistemas.
- **Top Termos**: Identifica os termos com maior peso (TF-IDF) em cada documento.
- **Evidências por Sentença**: Lista os pares de sentenças mais similares entre os dois documentos.
- **Parâmetros do núcleo**: `max_features=5000`, `ngram_range=(1,2)` e `stop_words=None`.
- **Limites de evidências**: até 12 termos relevantes por texto e 6 pares de sentenças.
- **PDF escaneado**: PDFs que contêm apenas imagens não têm texto extraído, pois o sistema não utiliza OCR.

## 🔧 Instalação

1. Certifique-se de ter o Python instalado.
2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

## 📖 Como Usar

### Via Linha de Comando (CLI)

Para comparar dois arquivos de texto rapidamente:
```bash
python run_cli.py caminho/para/textoA.txt caminho/para/textoB.txt
```

### Via API Web (FastAPI)

1. Inicie o servidor:
   ```bash
   uvicorn app:app --reload
   ```
2. Acesse a documentação automática em: `http://127.0.0.1:8000/docs`
3. Utilize o endpoint `POST /compare` enviando dois arquivos (`file_a` e `file_b`).
4. Para textos colados, utilize `POST /compare/texts` com JSON: `{"text_a": "...", "text_b": "..."}`.

As respostas incluem `similarity_0_1`, `similarity_percent`, os termos e os pares de sentenças. Também incluem `processing_time_ms`, correspondente somente ao processamento da comparação.

### Testes

Na pasta `backend`, instale as dependências de desenvolvimento e execute:
```bash
pip install -r requirements-dev.txt
python -m pytest
python run_test_cases.py
```

O último comando lê `textos_teste/caso_1` até `caso_5` e gera `resultados_testes.json`.

## 📁 Estrutura do Projeto

- `core_similarity.py`: Lógica central de processamento e cálculo de similaridade.
- `app.py`: Servidor FastAPI com suporte a upload de arquivos e extração de PDF.
- `run_cli.py`: Script para execução via terminal.
- `textos_teste/`: Pasta contendo exemplos para teste.
