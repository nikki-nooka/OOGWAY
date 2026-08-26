import os
import re
import json
from pathlib import Path
from typing import List, Dict, Any

class TranscriptIngester:
    """
    Ingestion engine for the official ChatPRD/lennys-podcast-transcripts repository.
    Reads transcript.md files from raw_repo/episodes/, parses YAML frontmatter and timestamped chunks.
    """

    @classmethod
    def parse_markdown_transcript(cls, file_path: Path) -> List[Dict[str, Any]]:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return []

        # 1. Parse YAML Frontmatter
        frontmatter_match = re.search(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
        if not frontmatter_match:
            return []

        raw_meta = frontmatter_match.group(1)
        body = frontmatter_match.group(2)

        meta = {}
        for line in raw_meta.split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip().strip("'\"")

        guest = meta.get("guest", file_path.parent.name.replace("-", " ").title())
        title = meta.get("title", f"Discussion with {guest}")
        source_url = meta.get("youtube_url", "https://www.lennyspodcast.com")
        episode_id = meta.get("video_id", file_path.parent.name[:10])

        # 2. Chunk transcript by sections or timestamps
        # Look for timestamp headers like "## [00:14:20] ..." or paragraphs
        paragraphs = [p.strip() for p in body.split("\n\n") if len(p.strip()) > 80]
        
        chunks = []
        for idx, p in enumerate(paragraphs[:15]): # Index top high-signal sections per episode
            # Extract timestamp if present (e.g. [12:30] or 12:30)
            ts_match = re.search(r"\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?", p)
            timestamp = ts_match.group(1) if ts_match else f"{idx * 3}:00"
            clean_text = re.sub(r"\[?\d{1,2}:\d{2}(?::\d{2})?\]?", "", p).strip()

            chunks.append({
                "id": f"{file_path.parent.name}_{idx}",
                "episode_id": episode_id,
                "episode_title": title,
                "guest": guest,
                "guest_bio": meta.get("description", "")[:120],
                "source_url": source_url,
                "topic": f"Product, Growth, Strategy, {guest}",
                "timestamp": timestamp,
                "text": clean_text
            })

        return chunks

    @classmethod
    def ingest_all(cls, repo_dir: Path, output_dir: Path):
        episodes_dir = repo_dir / "episodes"
        if not episodes_dir.exists():
            print(f"Directory {episodes_dir} does not exist.")
            return

        all_chunks = []
        episodes = [d for d in episodes_dir.iterdir() if d.is_dir()]
        print(f"Found {len(episodes)} total episodes in official ChatPRD repository.")

        for ep_dir in episodes:
            md_file = ep_dir / "transcript.md"
            if md_file.exists():
                parsed = cls.parse_markdown_transcript(md_file)
                all_chunks.extend(parsed)

        print(f"Parsed {len(all_chunks)} total transcript chunks across {len(episodes)} episodes.")
        
        # Save aggregated indexed knowledge cache
        os.makedirs(output_dir, exist_ok=True)
        out_file = output_dir / "chatprd_official_index.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(all_chunks, f, indent=2)
        print(f"Successfully generated official index at {out_file}")

if __name__ == "__main__":
    base = Path(__file__).resolve().parent
    repo_path = base / "raw_repo"
    out_path = base / "transcripts"
    TranscriptIngester.ingest_all(repo_path, out_path)
