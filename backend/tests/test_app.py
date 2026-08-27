import sys
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).parents[1]))

from app import app


client = TestClient(app)


def test_compare_texts_returns_compatible_result_and_processing_time():
    response = client.post("/compare/texts", json={"text_a": "Um texto de teste.", "text_b": "Um texto de exemplo."})
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["similarity_0_1"] <= 1
    assert 0 <= data["similarity_percent"] <= 100
    assert isinstance(data["processing_time_ms"], (int, float))
    assert "top_terms_a" in data and "top_sentence_pairs" in data


def test_compare_texts_rejects_missing_or_empty_fields():
    response = client.post("/compare/texts", json={"text_a": "texto"})
    assert response.status_code == 400
    assert "obrigatórios" in response.json()["detail"]
    response = client.post("/compare/texts", json={"text_a": " ", "text_b": "texto"})
    assert response.status_code == 400
    assert "não podem estar vazios" in response.json()["detail"]


def test_upload_endpoint_is_preserved():
    response = client.post(
        "/compare",
        files={"file_a": ("a.txt", "texto comum", "text/plain"), "file_b": ("b.txt", "texto comum", "text/plain")},
    )
    assert response.status_code == 200
    assert "processing_time_ms" in response.json()
