import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parents[1]))

from core_similarity import compare_texts_tfidf_cosine, normalize_text


def test_identical_texts_are_near_one():
    result = compare_texts_tfidf_cosine("Texto com acentuação e informação.", "Texto com acentuação e informação.")
    assert 0 <= result.similarity_0_1 <= 1 + 1e-9
    assert result.similarity_0_1 == pytest.approx(1.0)


def test_partial_similarity_is_higher_than_different_texts():
    partial = compare_texts_tfidf_cosine("O sistema compara documentos textuais.", "O sistema compara documentos acadêmicos.")
    different = compare_texts_tfidf_cosine("O sistema compara documentos textuais.", "A receita leva farinha e água.")
    assert 0 <= different.similarity_0_1 <= partial.similarity_0_1 <= 1


def test_synonyms_and_reordered_texts_are_processed_without_exceptions():
    synonym = compare_texts_tfidf_cosine("O aluno iniciou a pesquisa.", "O estudante começou o estudo.")
    reordered = compare_texts_tfidf_cosine("Primeira ideia. Segunda ideia.", "Segunda ideia. Primeira ideia.")
    assert 0 <= synonym.similarity_0_1 <= 1
    assert 0 <= reordered.similarity_0_1 <= 1
    assert reordered.similarity_0_1 >= 0.7


def test_normalized_empty_text_has_clear_error():
    with pytest.raises(ValueError, match="normalização"):
        compare_texts_tfidf_cosine("!!!", "texto")
