"""Collect private review copies from an explicit source register; never publish or import."""
import argparse, concurrent.futures, hashlib, json, re, shutil, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path
from pypdf import PdfReader
from html.parser import HTMLParser

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.title = []
        self.links = []
        self.in_title = False
        self.current_link = None
        self.skip = 0
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag in ["script", "style"]:
            self.skip += 1
        if tag == "title":
            self.in_title = True
        if tag == "a" and "href" in values:
            self.current_link = {"url": values["href"], "label": ""}
    def handle_endtag(self, tag):
        if tag in ["script", "style"]:
            self.skip = max(0, self.skip - 1)
        if tag == "title":
            self.in_title = False
        if tag == "a" and self.current_link:
            self.links.append(self.current_link)
            self.current_link = None
    def handle_data(self, value):
        if self.skip:
            return
        if self.in_title:
            self.title.append(value.strip())
        if self.current_link:
            self.current_link["label"] += value.strip() + " "
        if value.strip():
            self.text.append(value.strip())

ROOT = Path(__file__).resolve().parent

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; HakiYanguSourceReview/1.0)"})
    with urllib.request.urlopen(req, timeout=22) as response:
        data = response.read(30_000_001)
        if len(data) > 30_000_000:
            raise ValueError("Source exceeds 30 MB review-copy limit")
        return data, response.geturl(), response.headers.get("Content-Type", "")

def collect(source):
    sid = source["id"]
    result = {"sourceId": sid, "retrievedOn": "2026-10-05", "approvalStatus": "not_submitted", "productionEligible": False}
    url = source.get("downloadUrl") or source["recordUrl"]
    result["requestedUrl"] = url
    try:
        data, final_url, content_type = fetch(url)
        result.update(finalUrl=final_url, contentType=content_type, byteCount=len(data), sha256=hashlib.sha256(data).hexdigest())
        if data.lstrip().startswith(b"%PDF-"):
            path = ROOT / "source-files" / f"{sid.lower()}.pdf"
            path.write_bytes(data)
            reader = PdfReader(path)
            pages = [page.extract_text() or "" for page in reader.pages]
            text_path = ROOT / "extracted-text" / f"{sid.lower()}.txt"
            text_path.write_text("\n\n".join(f"[PDF PAGE {i+1}]\n{text}" for i, text in enumerate(pages)), encoding="utf-8")
            counts = [len(p.strip()) for p in pages]
            result.update(status="pdf_acquired_and_extracted", file=str(path.relative_to(ROOT)), textFile=str(text_path.relative_to(ROOT)), pages=len(pages), extractedCharacters=sum(counts), pagesWithVeryLittleText=[i+1 for i,c in enumerate(counts) if c < 80], extractionQuality="manual_review_required", documentIdentity="not_yet_reconciled_with_register")
            print(f"{sid}: PDF {len(pages)} pages, {sum(counts)} text characters", flush=True)
        else:
            parser = PageParser()
            parser.feed(data.decode("utf-8", errors="replace"))
            title = " ".join(parser.title)
            page_text = "\n".join(parser.text)
            challenge = any(term in (title + page_text[:1000]).lower() for term in ["one moment, please", "just a moment", "verify you are human", "access denied"])
            result.update(status="challenge_page" if challenge else "page_acquired", pageTitle=title, extractedCharacters=len(page_text))
            if not challenge:
                path = ROOT / "source-pages" / f"{sid.lower()}.html"
                path.write_bytes(data)
                links = []
                for a in parser.links:
                    href = urllib.parse.urljoin(final_url, a["url"])
                    label = a["label"].strip()
                    if re.search(r"\.pdf(?:$|\?)|/bitstreams/|/download(?:$|\?)|/content$", href, re.I) or "download" in label.lower():
                        links.append({"label": label, "url": href})
                result.update(file=str(path.relative_to(ROOT)), downloadCandidates=links[:80])
            print(f"{sid}: {result['status']}", flush=True)
    except Exception as error:
        result.update(status="fetch_failed", error=f"{type(error).__name__}: {error}")
        print(f"{sid}: failed: {type(error).__name__}", flush=True)
    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ids", nargs="*")
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()
    for directory in ["source-files", "source-pages", "extracted-text"]:
        (ROOT / directory).mkdir(exist_ok=True)
    register = json.loads((ROOT / "source-register.json").read_text())
    selected = [s for s in register["sources"] if not args.ids or s["id"] in args.ids]
    old_path = ROOT / "acquisition-manifest.json"
    old = json.loads(old_path.read_text()) if old_path.exists() else {"schemaVersion": 1, "privateReviewCopiesOnly": True, "sources": []}
    results = {r["sourceId"]: r for r in old["sources"]}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for result in pool.map(collect, selected):
            with (ROOT / 'acquisition-attempts.jsonl').open('a', encoding='utf-8') as history:
                history.write(json.dumps(result, ensure_ascii=False) + '\n')
            results[result["sourceId"]] = result
            old["sources"] = list(results.values())
            old_path.write_text(json.dumps(old, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"total": len(results), "pdfs": sum(r["status"] == "pdf_acquired_and_extracted" for r in results.values()), "pages": sum(r.get("pages", 0) for r in results.values()), "failed": sum(r["status"] in ["fetch_failed", "challenge_page"] for r in results.values())}), flush=True)

if __name__ == "__main__":
    main()
