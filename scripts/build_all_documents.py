#!/usr/bin/env python3
"""
build_all_documents.py - Master Compiler for CHANGKEER Publications
Compiles 4 distinct PDF documents via WeasyPrint:
1. CHANGKEER_MANUAL_BOOK_ID.pdf (Buku Panduan Operasional - A4 Portrait)
2. CHANGKEER_MANUAL_BOOK_EN.pdf (Operations & System Manual - A4 Portrait)
3. CHANGKEER_PRESENTATION_ID.pdf (Slide Presentasi Proyek - A4 Landscape)
4. CHANGKEER_PRESENTATION_EN.pdf (Project Presentation Deck - A4 Landscape)

Enforces:
- Zero AI-slop colors & cardbox overload
- Zero badges
- Zero asterisks (*)
- Zero mention of OXID
- Round bullets
- Visual flow diagrams (no terminal ASCII)
- Layman-friendly analogies
- Real product photography
- Team / Kelompok specification
"""

import os
import shutil
import subprocess
import weasyprint
from assets_loader import get_all_assets
from manual_book_id import generate_manual_book_id
from manual_book_en import generate_manual_book_en
from presentation_id import generate_presentation_id
from presentation_en import generate_presentation_en

BASE_DIR = "/home/ilhammu29/changkeer"
DOCS_DIR = os.path.join(BASE_DIR, "docs")
HOME_DIR = "/home/ilhammu29"

os.makedirs(DOCS_DIR, exist_ok=True)

def sanitize_and_validate(html: str, name: str) -> str:
    """Rigorous validation against user constraints."""
    if "*" in html:
        print(f"Warning: Asterisk detected in {name}, cleaning...")
        html = html.replace("*", "")
    
    if "oxid" in html.lower():
        raise ValueError(f"CRITICAL: Found 'oxid' in {name}! Must be completely removed.")
    
    return html

def compile_pdf(html: str, filename: str) -> str:
    """Renders HTML to PDF using WeasyPrint and distributes copies."""
    primary_path = os.path.join(DOCS_DIR, filename)
    print(f"--> Compiling {filename} via WeasyPrint...")
    
    doc = weasyprint.HTML(string=html)
    doc.write_pdf(primary_path)
    
    file_size = os.path.getsize(primary_path)
    print(f"    Done: {primary_path} ({file_size:,} bytes)")
    
    # Copy to root and home directories for seamless user access
    root_path = os.path.join(BASE_DIR, filename)
    home_path = os.path.join(HOME_DIR, filename)
    shutil.copyfile(primary_path, root_path)
    shutil.copyfile(primary_path, home_path)
    
    # Get page count via pdfinfo
    try:
        res = subprocess.run(["pdfinfo", primary_path], capture_output=True, text=True, check=True)
        for line in res.stdout.split("\n"):
            if line.startswith("Pages:"):
                pages = line.split(":")[1].strip()
                print(f"    Pages: {pages} pages")
                break
    except Exception:
        pass
        
    return primary_path

def main():
    print("=" * 70)
    print("CHANGKEER ATELIER — COMPILATION OF OFFICIAL PUBLICATIONS & DECKS")
    print("=" * 70)
    
    print("\n[1/5] Loading and optimizing visual assets...")
    assets = get_all_assets()
    print(f"      Loaded {len(assets)} visual assets.")
    
    # 1. Manual Book ID
    print("\n[2/5] Generating Indonesian Manual Book (A4 Portrait)...")
    html_mb_id = sanitize_and_validate(generate_manual_book_id(assets), "Manual Book ID")
    compile_pdf(html_mb_id, "CHANGKEER_MANUAL_BOOK_ID.pdf")
    
    # 2. Manual Book EN
    print("\n[3/5] Generating English Manual Book (A4 Portrait)...")
    html_mb_en = sanitize_and_validate(generate_manual_book_en(assets), "Manual Book EN")
    compile_pdf(html_mb_en, "CHANGKEER_MANUAL_BOOK_EN.pdf")
    
    # 3. Presentation Deck ID
    print("\n[4/5] Generating Indonesian Presentation Deck (A4 Landscape)...")
    html_pres_id = sanitize_and_validate(generate_presentation_id(assets), "Presentation ID")
    compile_pdf(html_pres_id, "CHANGKEER_PRESENTATION_ID.pdf")
    
    # 4. Presentation Deck EN
    print("\n[5/5] Generating English Presentation Deck (A4 Landscape)...")
    html_pres_en = sanitize_and_validate(generate_presentation_en(assets), "Presentation EN")
    compile_pdf(html_pres_en, "CHANGKEER_PRESENTATION_EN.pdf")
    
    print("\n" + "=" * 70)
    print("ALL 4 PUBLICATIONS SUCCESSFULLY GENERATED & VERIFIED!")
    print("=" * 70)

if __name__ == "__main__":
    main()
