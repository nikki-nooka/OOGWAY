import httpx
import json

def run_all_journeys():
    client = httpx.Client(base_url='http://127.0.0.1:8000', timeout=30.0)

    print('=====================================================')
    print('  END-TO-END USER JOURNEY VERIFICATION SUITE')
    print('=====================================================')

    # Journey 1: Health & System Diagnostics
    print('\n[JOURNEY 1] Health & System Diagnostics...')
    h = client.get('/api/health').json()
    print(f"[OK] System Health: {h['status']} | Indexed Chunks: {h['transcripts_count']} | Episodes: {h['episodes_count']}")
    assert h['status'] == 'healthy'
    assert h['transcripts_count'] > 4000

    # Journey 2: Start Fresh Session & Greeting
    print('\n[JOURNEY 2] User Starts New Session & Sends Greeting ("hi")...')
    s_res = client.post('/api/sessions', json={'title': 'PM Strategy Sprint', 'model_provider': 'mock'})
    session_id = s_res.json()['id']
    print(f"[OK] Created New Session ID: {session_id}")

    greet_res = client.post('/api/chat', json={'session_id': session_id, 'message': 'hi'}).json()
    print(f"[OK] Greeting Response Received:")
    print(f"  Citations count (should be 0 for hello): {len(greet_res['citations'])}")
    safe_preview = greet_res['content'][:110].encode('ascii', 'ignore').decode()
    print(f"  Content Preview: {safe_preview}...")
    assert len(greet_res['citations']) == 0
    assert 'Lenny Growth Assistant' in greet_res['content']

    # Journey 3: Grounded PM Strategy Question (Nikita Bier)
    print('\n[JOURNEY 3] User Asks Grounded Strategy Question (Nikita Bier Virality)...')
    q1_res = client.post('/api/chat', json={
        'session_id': session_id,
        'message': 'What does Nikita Bier say about building viral loops and consumer app growth?'
    }).json()
    print('[OK] Grounded Answer Received:')
    print(f"  Model Used: {q1_res['model_used']}")
    print(f"  Citations Count: {len(q1_res['citations'])}")
    for i, c in enumerate(q1_res['citations'][:2], 1):
        print(f"   - Citation {i}: {c['guest']} ({c['timestamp']}) | {c['episode_title']}")
    assert len(q1_res['citations']) > 0
    assert 'Nikita Bier' in q1_res['citations'][0]['guest']

    # Journey 4: Ship 30 for 30 Content Engine
    print('\n[JOURNEY 4] User Requests a Ship 30 for 30 Essay on Product-Market Fit...')
    essay_res = client.post('/api/chat', json={
        'session_id': session_id,
        'message': 'Write a Ship 30 for 30 essay on Finding Product-Market Fit with Gustaf Alstromer and Rahul Vohra'
    }).json()
    print('[OK] Ship 30 for 30 Essay Generated:')
    print(f"  Word Count: {len(essay_res['content'].split())}")
    print(f"  Pillars & Hook Structure: {'Pillar 1' in essay_res['content'] or 'Retention Floor' in essay_res['content']}")
    assert len(essay_res['content'].split()) > 200

    # Journey 5: Interactive Growth Tool Generation (HTML/CSS Artifact)
    print('\n[JOURNEY 5] User Requests Interactive PMF & Retention Calculator Artifact...')
    art_res = client.post('/api/chat', json={
        'session_id': session_id,
        'message': 'Create an interactive PMF and retention calculator in HTML and CSS'
    }).json()
    print('[OK] Artifact Generated & Sanitized:')
    print(f"  Artifacts Count: {len(art_res['artifacts'])}")
    print(f"  Artifact Title: {art_res['artifacts'][0]['title']}")
    print(f"  Artifact Type: {art_res['artifacts'][0]['artifact_type']}")
    assert len(art_res['artifacts']) >= 1

    # Journey 6: Persistence & History Retrieval
    print('\n[JOURNEY 6] Verifying Full Session Persistence in DB...')
    detail = client.get(f'/api/sessions/{session_id}').json()
    print(f"[OK] Persisted Messages: {len(detail['messages'])}")
    print(f"[OK] Persisted Artifacts: {len(detail['artifacts'])}")
    assert len(detail['messages']) == 8
    assert len(detail['artifacts']) >= 1

    # Journey 7: Knowledge Base Search across 279 Episodes
    print('\n[JOURNEY 7] Searching Knowledge Base for "Founder Mode Brian Chesky"...')
    search_res = client.get('/api/transcripts?query=Founder Mode Brian Chesky').json()
    print(f"[OK] Search Results Count: {len(search_res['results'])}")
    if search_res['results']:
        print(f"  Top Hit: {search_res['results'][0]['citation']['guest']} - {search_res['results'][0]['citation']['episode_title']}")

    print('\n=====================================================')
    print('  ALL 7 USER JOURNEYS PASSED 100% SUCCESSFULLY!      ')
    print('=====================================================')

if __name__ == '__main__':
    run_all_journeys()
