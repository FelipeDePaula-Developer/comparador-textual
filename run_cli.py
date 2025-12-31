# run_cli.py
from __future__ import annotations

import sys
from pathlib import Path
from core_similarity import compare_texts_tfidf_cosine


def read_text_file(path: str) -> str:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {path}")
    # tenta utf-8; se falhar, cai pra latin-1
    try:
        return p.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return p.read_text(encoding="latin-1")


def main() -> int:
    if len(sys.argv) < 3:
        print("Uso: python run_cli.py <arquivoA.txt> <arquivoB.txt>")
        return 2

    text_a = read_text_file(sys.argv[1])
    text_b = read_text_file(sys.argv[2])

    result = compare_texts_tfidf_cosine(text_a, text_b)

    print("\n=== RESULTADO ===")
    print(f"Similaridade (0–1): {result.similarity_0_1:.4f}")
    print(f"Similaridade (%):   {result.similarity_percent:.2f}%")

    print("\n=== PRINCIPAIS TERMOS (A) ===")
    for term, w in result.top_terms_a:
        print(f"{term:>20}  {w:.6f}")

    print("\n=== PRINCIPAIS TERMOS (B) ===")
    for term, w in result.top_terms_b:
        print(f"{term:>20}  {w:.6f}")

    print("\n=== EVIDÊNCIAS (PARES DE SENTENÇAS) ===")
    for p in result.top_sentence_pairs:
        print(f"\nscore={p['score_0_1']:.4f} ({p['score_percent']:.2f}%)")
        print(f"A[{p['sent_a_index']}]: {p['sent_a']}")
        print(f"B[{p['sent_b_index']}]: {p['sent_b']}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
