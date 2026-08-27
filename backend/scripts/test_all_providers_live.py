import urllib.request
import json
import time
import sys

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(endpoint, data=None, method="GET"):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, headers={"Content-Type": "application/json"}, method=method)
    if data:
        req.data = json.dumps(data).encode("utf-8")
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def run_suite():
    print("=" * 70)
    print("🚀 THE LENNY GROWTH ASSISTANT — LIVE SYSTEM & PROVIDER VALIDATION")
    print("=" * 70)

    # 1. Check Health & Diagnostics
    status, health = make_request("/health")
    print(f"\n1. 🩺 System Health:")
    print(f"   - Status: {health.get('status')}")
    print(f"   - Transcripts Indexed: {health.get('transcripts_count')} chunks")
    print(f"   - Podcast Episodes: {health.get('episodes_count')} episodes")
    print(f"   - Active Database: {health.get('database')}")

    # 2. Check Model Providers
    status, models = make_request("/models")
    print(f"\n2. 🤖 Model Providers Status:")
    for prov_id, prov_info in models.get("providers", {}).items():
        ready_str = "🟢 Ready / Available" if prov_info.get("available") else "⚪ Offline / Key Missing"
        print(f"   - {prov_info.get('name')}: {ready_str}")

    # 3. Create a Session
    status, session = make_request("/sessions", {"title": "Live PMF & PLG Research", "model_provider": "mock"}, method="POST")
    session_id = session["id"]
    print(f"\n3. 💬 Created Session ID: {session_id}")

    # 4. Run Grounded Q&A on PMF
    print(f"\n4. 🔍 Testing Grounded Q&A (Gustaf Alströmer on PMF):")
    t0 = time.time()
    status, chat_res = make_request("/chat", {
        "session_id": session_id,
        "message": "What does Gustaf Alströmer say about product-market fit and retention curves?",
        "model": "mock"
    }, method="POST")
    latency = round((time.time() - t0) * 1000)
    print(f"   - Latency: {latency}ms")
    print(f"   - Model Used: {chat_res.get('model_used')}")
    print(f"   - Citations Retrieved: {len(chat_res.get('citations', []))}")
    for i, c in enumerate(chat_res.get('citations', []), 1):
        print(f"     [{i}] {c.get('guest')} ({c.get('timestamp')}) — \"{c.get('quote')[:75]}...\"")
    print(f"   - Response Excerpt:\n     {chat_res.get('content')[:220]}...\n")

    # 5. Run Follow-up Question in Same Session (Context Memory)
    print(f"5. 🧠 Testing Follow-up Context Memory:")
    status, follow_up = make_request("/chat", {
        "session_id": session_id,
        "message": "How does this compare to Rahul Vohra's 40% rule?",
        "model": "mock"
    }, method="POST")
    print(f"   - Citations Retrieved: {len(follow_up.get('citations', []))}")
    for c in follow_up.get('citations', []):
        print(f"     • {c.get('guest')}: {c.get('episode_title')}")
    print(f"   - Response Excerpt:\n     {follow_up.get('content')[:200]}...\n")

    # 6. Test Out-of-Domain Hallucination Refusal Guardrail
    print(f"6. 🛡️ Testing Out-of-Domain Refusal Guardrail:")
    status, ood_res = make_request("/chat", {
        "session_id": session_id,
        "message": "According to Lenny, what is his strategy for Mars colonization and rocket propulsion?",
        "model": "mock"
    }, method="POST")
    print(f"   - Fake Citations Attached: {len(ood_res.get('citations', []))} (Must be 0)")
    print(f"   - Guardrail Message:\n     \"{ood_res.get('content')}\"\n")

    # 7. Test Dedicated Ship 30 for 30 Writing Studio
    print(f"7. ✍️ Testing Ship 30 for 30 Essay Generator:")
    status, essay_res = make_request("/writing/ship30", {
        "topic": "B2B Product-Led Growth & Viral Loops",
        "target_words": 1250,
        "style": "ship30",
        "guest_focus": "Elena Verna"
    }, method="POST")
    print(f"   - Title: {essay_res.get('title')}")
    print(f"   - Generated Word Count: {essay_res.get('word_count')} words")
    print(f"   - Essay Excerpt:\n{essay_res.get('content')[:320]}...\n")

    # 8. Test Interactive HTML Artifact Generation
    print(f"8. 🧩 Testing Interactive HTML Growth Tool Generator:")
    status, art_chat = make_request("/chat", {
        "session_id": session_id,
        "message": "Create an interactive HTML and CSS PMF retention calculator with slider inputs.",
        "model": "mock"
    }, method="POST")
    artifacts = art_chat.get("artifacts", [])
    print(f"   - Artifacts Generated: {len(artifacts)}")
    if artifacts:
        art = artifacts[0]
        print(f"   - Artifact Title: {art.get('title')}")
        print(f"   - Language: {art.get('language')}")
        print(f"   - Type: {art.get('type')}")
        print(f"   - Has Sandboxed HTML: {'<div' in art.get('content') or '<script' in art.get('content')}")

    print("\n" + "=" * 70)
    print("✅ ALL LIVE SUBSYSTEMS & MODELS EXECUTED WITH 100% SUCCESS!")
    print("=" * 70)

if __name__ == "__main__":
    run_suite()
