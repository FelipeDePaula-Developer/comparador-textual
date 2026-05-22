# app.py
from __future__ import annotations

import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

from core_similarity import compare_texts_tfidf_cosine

app = FastAPI(title="Comparador Textual TF-IDF + Cosseno")

# Configurar CORS para o frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique a URL do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def extract_text_from_upload(upload: UploadFile) -> str:
    filename = upload.filename.lower()
    data = await upload.read()

    if filename.endswith(".pdf"):
        try:
            pdf_file = io.BytesIO(data)
            reader = PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao processar PDF {upload.filename}: {str(e)}")

    # Assume que é um arquivo de texto se não for PDF
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        try:
            return data.decode("latin-1")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail=f"Não foi possível decodificar o arquivo {upload.filename}")


@app.post("/compare")
async def compare(file_a: UploadFile = File(...), file_b: UploadFile = File(...)):
    text_a = await extract_text_from_upload(file_a)
    text_b = await extract_text_from_upload(file_b)

    if not text_a.strip() or not text_b.strip():
        raise HTTPException(status_code=400, detail="Um ou ambos os arquivos estão vazios ou não contêm texto extraível.")

    result = compare_texts_tfidf_cosine(text_a, text_b)

    payload = {
        "similarity_0_1": round(result.similarity_0_1, 6),
        "similarity_percent": round(result.similarity_percent, 2),
        "top_terms_a": [{"term": t, "weight": round(w, 6)} for t, w in result.top_terms_a],
        "top_terms_b": [{"term": t, "weight": round(w, 6)} for t, w in result.top_terms_b],
        "top_sentence_pairs": [
            {
                "score_0_1": round(p["score_0_1"], 6),
                "score_percent": round(p["score_percent"], 2),
                "sent_a_index": p["sent_a_index"],
                "sent_b_index": p["sent_b_index"],
                "sent_a": p["sent_a"],
                "sent_b": p["sent_b"],
            }
            for p in result.top_sentence_pairs
        ],
    }
    return JSONResponse(payload)
