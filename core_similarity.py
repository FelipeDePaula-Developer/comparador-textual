# core_similarity.py
from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from typing import List, Tuple, Dict

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def normalize_text(text: str) -> str:
    # normaliza unicode e remove caracteres invisíveis
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("\u00a0", " ").replace("\u200b", " ")
    # lowercase
    text = text.lower()
    # remove pontuação excessiva mantendo letras/números/espaco
    text = re.sub(r"[^\w\sáàâãéèêíìîóòôõúùûç]", " ", text, flags=re.UNICODE)
    # colapsa espaços
    text = re.sub(r"\s+", " ", text).strip()
    return text


def split_sentences(text: str) -> List[str]:
    # segmentação simples por pontuação (suficiente para relatório)
    chunks = re.split(r"(?<=[\.\!\?])\s+", text.strip())
    chunks = [c.strip() for c in chunks if c.strip()]
    return chunks if chunks else [text.strip()]


@dataclass
class SimilarityResult:
    similarity_0_1: float
    similarity_percent: float
    top_terms_a: List[Tuple[str, float]]
    top_terms_b: List[Tuple[str, float]]
    top_sentence_pairs: List[Dict[str, object]]


def compare_texts_tfidf_cosine(
    text_a: str,
    text_b: str,
    *,
    max_features: int = 5000,
    ngram_range: Tuple[int, int] = (1, 2),
    top_k_terms: int = 12,
    top_k_sentence_pairs: int = 6
) -> SimilarityResult:
    a = normalize_text(text_a)
    b = normalize_text(text_b)

    vectorizer = TfidfVectorizer(
        max_features=max_features,
        ngram_range=ngram_range,
        stop_words=None  # se quiser, troque por lista pt-br
    )

    X = vectorizer.fit_transform([a, b])
    sim = float(cosine_similarity(X[0], X[1])[0, 0])
    sim_pct = sim * 100.0

    # termos com maior peso em cada documento
    feature_names = np.array(vectorizer.get_feature_names_out())
    vec_a = X[0].toarray().ravel()
    vec_b = X[1].toarray().ravel()

    idx_a = np.argsort(vec_a)[::-1][:top_k_terms]
    idx_b = np.argsort(vec_b)[::-1][:top_k_terms]

    top_terms_a = [(feature_names[i], float(vec_a[i])) for i in idx_a if vec_a[i] > 0]
    top_terms_b = [(feature_names[i], float(vec_b[i])) for i in idx_b if vec_b[i] > 0]

    # pares de sentenças mais semelhantes (evidência para a seção de resultados)
    sents_a = split_sentences(text_a)
    sents_b = split_sentences(text_b)

    # vetorização por sentença (mesmo vocabulário para comparabilidade)
    sents_a_n = [normalize_text(x) for x in sents_a]
    sents_b_n = [normalize_text(x) for x in sents_b]

    XS = vectorizer.fit_transform(sents_a_n + sents_b_n)
    XA = XS[: len(sents_a)]
    XB = XS[len(sents_a) :]

    S = cosine_similarity(XA, XB)

    # pega top pares globais
    pairs = []
    for i in range(S.shape[0]):
        for j in range(S.shape[1]):
            pairs.append((i, j, float(S[i, j])))
    pairs.sort(key=lambda x: x[2], reverse=True)
    pairs = pairs[:top_k_sentence_pairs]

    top_sentence_pairs = []
    for i, j, score in pairs:
        top_sentence_pairs.append({
            "sent_a_index": i,
            "sent_b_index": j,
            "score_0_1": score,
            "score_percent": score * 100.0,
            "sent_a": sents_a[i],
            "sent_b": sents_b[j],
        })

    return SimilarityResult(
        similarity_0_1=sim,
        similarity_percent=sim_pct,
        top_terms_a=top_terms_a,
        top_terms_b=top_terms_b,
        top_sentence_pairs=top_sentence_pairs,
    )
