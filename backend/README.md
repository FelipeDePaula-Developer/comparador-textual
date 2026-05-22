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

- **Normalização de Texto**: Remoção de caracteres especiais, acentos, conversão para minúsculas e colapso de espaços.
- **Suporte a Arquivos**: Processa arquivos de texto puro (`.txt`) e documentos em `.pdf`.
- **Interface CLI**: Ferramenta de linha de comando para execuções rápidas.
- **API Web**: Endpoint REST para integração com frontends ou outros sistemas.
- **Top Termos**: Identifica os termos com maior peso (TF-IDF) em cada documento.
- **Evidências por Sentença**: Lista os pares de sentenças mais similares entre os dois documentos.

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

## 📁 Estrutura do Projeto

- `core_similarity.py`: Lógica central de processamento e cálculo de similaridade.
- `app.py`: Servidor FastAPI com suporte a upload de arquivos e extração de PDF.
- `run_cli.py`: Script para execução via terminal.
- `textos_teste/`: Pasta contendo exemplos para teste.
