# app.py
from __future__ import annotations

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

from core_similarity import compare_texts_tfidf_cosine

app = FastAPI(title="Comparador Textual TF-IDF + Cosseno")


async def read_upload(upload: UploadFile) -> str:
    data = await upload.read()
    # tenta utf-8, depois latin-1
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        return data.decode("latin-1", errors="ignore")


@app.post("/compare")
async def compare(file_a: UploadFile = File(...), file_b: UploadFile = File(...)):
    text_a = await read_upload(file_a)
    text_b = await read_upload(file_b)

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
