"""
Automated Test Suite for Differentiating Intelligence Capabilities:
1. Challenge Advice (Counterpoints & Failure Modes)
2. Apply to Context (Tailored Playbook Generation)
3. Decision Mode (Trade-off Matrix & Memo Generation)
4. Experiment Generator (Hypothesis, Sample Size, Guardrails)
5. Framework Builder (Visual ASCII & Markdown Hierarchy)
6. Guest Comparison (Consensus vs Disagreement)
7. Knowledge Graph (Node & Edge Topology)
8. PMF Diagnostic Engine (6-Signal Transparent Scoring)
9. Writing Grounding Evaluator (Transcript Claim Verification)
10. API Endpoint Integration Verification
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.engine.intelligence_engine import intelligence_engine

@pytest.mark.asyncio
async def test_challenge_advice_engine():
    res = intelligence_engine.challenge_advice(topic="Product-Market Fit", claim="Always scale acquisition first")
    assert res["topic"] == "Product-Market Fit"
    assert "primary_consensus" in res
    assert len(res["failure_conditions"]) > 0
    assert len(res["supporting_evidence"]) > 0
    assert "when_it_applies" in res

@pytest.mark.asyncio
async def test_apply_context_engine():
    ctx = {
        "company_type": "B2B SaaS",
        "users": "10,000",
        "activation": "15%",
        "problem": "Drop-off during onboarding",
        "constraints": "Small engineering team"
    }
    res = intelligence_engine.apply_context(context=ctx, topic="Activation & Onboarding")
    assert "B2B SaaS" in res["situation_summary"]
    assert len(res["core_principles"]) > 0
    assert len(res["recommended_actions"]) == 3
    assert len(res["key_risks"]) > 0

@pytest.mark.asyncio
async def test_generate_decision_memo():
    res = intelligence_engine.generate_decision_memo(
        decision_question="Should we prioritize PLG or Enterprise Sales?",
        options=["Self-Serve PLG", "Top-Down Enterprise Sales"],
        constraints="Early stage, 6 months runway"
    )
    assert "Decision Memo" in res["title"]
    assert len(res["options"]) == 2
    assert "Strategic Comparison Matrix" in res["artifact_content"]
    assert len(res["options"][0]["strengths"]) > 0

@pytest.mark.asyncio
async def test_generate_experiment_brief():
    res = intelligence_engine.generate_experiment_brief(
        problem="Users drop off on step 4 of signup",
        metric="Day-1 Activation Rate",
        hypothesis="Simplifying signup from 5 fields to 2 will increase activation by 15%"
    )
    assert res["primary_metric"] == "Day-1 Activation Rate"
    assert "Experiment Brief" in res["title"]
    assert "Statistical & Guardrail Framework" in res["artifact_content"]

@pytest.mark.asyncio
async def test_build_framework():
    res = intelligence_engine.build_framework(concept="Cohort Retention Loops")
    assert res["concept"] == "Cohort Retention Loops"
    assert "PYRAMID" in res["diagram"] or "FOUNDATION" in res["diagram"] or "┌" in res["diagram"]
    assert "The Value Foundation" in res["artifact_content"]

@pytest.mark.asyncio
async def test_compare_guests():
    res = intelligence_engine.compare_guests(topic="Pricing & Packaging")
    assert res["topic"] == "Pricing & Packaging"
    assert len(res["guests_compared"]) > 0
    assert "consensus" in res
    assert "disagreements" in res

@pytest.mark.asyncio
async def test_knowledge_graph():
    res = intelligence_engine.get_knowledge_graph()
    assert res["total_nodes"] >= 9
    assert res["total_edges"] >= 8
    assert any(n["id"] == "pmf" for n in res["nodes"])

@pytest.mark.asyncio
async def test_pmf_diagnostic_calculation():
    # Strong PMF signals
    res_strong = intelligence_engine.evaluate_pmf_diagnostic({
        "retention": 0.80,
        "activation": 0.70,
        "repeat_usage": 0.75,
        "referral": 0.60,
        "willingness_to_pay": 0.85,
        "usage_frequency": 0.70
    })
    assert res_strong["score"] >= 75
    assert res_strong["status"] == "Strong PMF"
    assert len(res_strong["strong_signals"]) > 0

    # Weak PMF signals
    res_weak = intelligence_engine.evaluate_pmf_diagnostic({
        "retention": 0.20,
        "activation": 0.25,
        "repeat_usage": 0.30,
        "referral": 0.10,
        "willingness_to_pay": 0.20,
        "usage_frequency": 0.20
    })
    assert res_weak["score"] < 50
    assert res_weak["status"] == "Pre-PMF (Discovery Needed)"
    assert len(res_weak["weak_signals"]) > 0

@pytest.mark.asyncio
async def test_essay_grounding_verifier():
    essay = """# How to Measure PMF

Product-market fit is when your retention curve flattens parallel to the x-axis.

Brian Chesky describes the 11-star experience as designing beyond what customers could dream of.

Rahul Vohra popularized the Sean Ellis survey where forty percent of users must be very disappointed."""

    res = intelligence_engine.verify_essay_grounding(essay)
    assert res["total_claims_evaluated"] > 0
    assert res["grounding_confidence_pct"] >= 50.0

@pytest.mark.asyncio
async def test_api_routes_integration():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Challenge endpoint
        ch_res = await ac.post("/api/challenge", json={"topic": "Retention", "claim": "Scaling before retention"})
        assert ch_res.status_code == 200
        assert "failure_conditions" in ch_res.json()

        # Apply Context endpoint
        ctx_res = await ac.post("/api/apply-context", json={"topic": "Onboarding", "company_type": "B2B SaaS"})
        assert ctx_res.status_code == 200
        assert "core_principles" in ctx_res.json()

        # Decisions endpoint
        dec_res = await ac.post("/api/decisions", json={"decision_question": "PLG vs Sales?", "options": ["PLG", "Sales"]})
        assert dec_res.status_code == 200
        assert "artifact_id" in dec_res.json()

        # Experiments endpoint
        exp_res = await ac.post("/api/experiments", json={"problem": "High churn on day 1"})
        assert exp_res.status_code == 200
        assert "artifact_id" in exp_res.json()

        # Frameworks endpoint
        fw_res = await ac.post("/api/frameworks", json={"concept": "LNO Prioritization"})
        assert fw_res.status_code == 200
        assert "artifact_id" in fw_res.json()

        # Knowledge Graph endpoint
        kg_res = await ac.get("/api/knowledge-graph")
        assert kg_res.status_code == 200
        assert "nodes" in kg_res.json()

        # PMF Diagnostic endpoint
        pmf_res = await ac.post("/api/pmf-diagnostic", json={"retention": 0.70, "activation": 0.60})
        assert pmf_res.status_code == 200
        assert "score" in pmf_res.json()
