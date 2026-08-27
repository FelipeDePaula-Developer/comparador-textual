import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from core_similarity import compare_texts_tfidf_cosine


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="latin-1")


def main() -> int:
    backend_dir = Path(__file__).parent
    cases_dir = backend_dir.parent / "textos_teste"
    results = []
    for case_dir in sorted(cases_dir.glob("caso_[1-5]")):
        path_a = case_dir / "textoA.txt"
        path_b = case_dir / "textoB.txt"
        started_at = time.perf_counter()
        result = compare_texts_tfidf_cosine(read_text(path_a), read_text(path_b))
        elapsed_ms = (time.perf_counter() - started_at) * 1000
        results.append({
            "caso": case_dir.name,
            "arquivo_a": str(path_a),
            "arquivo_b": str(path_b),
            "similarity_0_1": result.similarity_0_1,
            "similarity_percent": result.similarity_percent,
            "processing_time_ms": round(elapsed_ms, 3),
        })
    output_path = backend_dir / "resultados_testes.json"
    output_path.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Resultados gravados em {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
