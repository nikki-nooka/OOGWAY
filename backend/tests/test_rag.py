import pytest
from app.engine.rag import rag_engine

def test_rag_loaded():
    assert len(rag_engine.chunks) > 0
    assert len(rag_engine.get_all_episodes()) >= 8

def test_rag_search_shreyas_lno():
    results = rag_engine.search("What is the LNO framework by Shreyas Doshi?", top_k=3)
    assert len(results) > 0
    top_chunk = results[0]["chunk"]
    assert "Shreyas Doshi" in top_chunk.guest
    assert "LNO" in top_chunk.text or "LNO" in top_chunk.topic
    assert results[0]["citation"].timestamp != ""

def test_rag_search_chesky_11_star():
    results = rag_engine.search("Brian Chesky 11 star experience Airbnb", top_k=2)
    assert len(results) > 0
    top_chunk = results[0]["chunk"]
    assert "Brian Chesky" in top_chunk.guest
    assert "11-star" in top_chunk.text or "11-Star" in top_chunk.text

def test_rag_search_rahul_pmf():
    results = rag_engine.search("Rahul Vohra Superhuman 40% disappointed rule", top_k=2)
    assert len(results) > 0
    top_chunk = results[0]["chunk"]
    assert "Rahul Vohra" in top_chunk.guest
    assert "40%" in top_chunk.text

def test_rag_format_context():
    results = rag_engine.search("Product-Led Growth Elena Verna", top_k=2)
    context = rag_engine.format_context_for_prompt(results)
    assert "Elena Verna" in context
    assert "Source 1:" in context
