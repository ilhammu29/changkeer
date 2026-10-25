#!/usr/bin/env python3
"""
assets_loader.py - Asset Loader and Preprocessor for CHANGKEER Publications
Loads official web logo (logo_new.png) and all 24 Seasonal Products from solarTerms.ts
"""
import os
import io
import re
import base64
from PIL import Image

BASE_DIR = "/home/ilhammu29/changkeer"
SEASON_IMG_DIR = os.path.join(BASE_DIR, "assets-changker/24_product_season")
LOGO_PATH = os.path.join(BASE_DIR, "public/images/logo_new.png")
SOLAR_TERMS_TS = os.path.join(BASE_DIR, "lib/data/solarTerms.ts")

def load_optimized_b64(path: str, max_dim: int = 400, quality: int = 80) -> str:
    """Loads an image, resizes it proportionally, and returns a clean data URI."""
    if not os.path.exists(path):
        return ""
    try:
        im = Image.open(path)
        im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
        if im.mode in ('RGBA', 'P'):
            # Convert with white background for clean presentation
            bg = Image.new('RGB', im.size, (255, 255, 255))
            if im.mode == 'RGBA':
                bg.paste(im, mask=im.split()[3])
            else:
                bg.paste(im)
            im = bg
        elif im.mode != 'RGB':
            im = im.convert('RGB')
        buf = io.BytesIO()
        im.save(buf, format='JPEG', quality=quality, optimize=True)
        return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode('utf-8')
    except Exception as e:
        print(f"Warning: could not process image {path}: {e}")
        return ""

def get_solar_terms_data() -> list:
    """Parses all 24 blends from solarTerms.ts and attaches thumbnail base64 data."""
    if not os.path.exists(SOLAR_TERMS_TS):
        return []
    
    with open(SOLAR_TERMS_TS, "r", encoding="utf-8") as f:
        text = f.read()

    pattern = re.compile(
        r'term:\s*[\'\"](?P<term>[^\'\"]+)[\'\"].*?'
        r'termChinese:\s*[\'\"](?P<termChinese>[^\'\"]+)[\'\"].*?'
        r'season:\s*[\'\"](?P<season>[^\'\"]+)[\'\"].*?'
        r'seasonName:\s*[\'\"](?P<seasonName>[^\'\"]+)[\'\"].*?'
        r'blend:\s*[\'\"](?P<blend>[^\'\"]+)[\'\"].*?'
        r'hotPrice:\s*[\'\"](?P<hotPrice>[^\'\"]+)[\'\"].*?'
        r'icedPrice:\s*[\'\"](?P<icedPrice>[^\'\"]+)[\'\"].*?'
        r'ingredients:\s*\[(?P<ingredients>[^\]]+)\].*?'
        r'temperature:\s*[\'\"](?P<temperature>[^\'\"]+)[\'\"].*?'
        r'note:\s*[\'\"](?P<note>[^\'\"]+)[\'\"]',
        re.DOTALL
    )

    items = []
    for m in pattern.finditer(text):
        d = m.groupdict()
        # Parse ingredients clean list
        d['ingredients'] = [i.strip(' \'"\n\r') for i in d['ingredients'].split(',') if i.strip(' \'"\n\r')]
        
        # Match image
        img_filename = f"{d['term']}.jpg"
        img_path = os.path.join(SEASON_IMG_DIR, img_filename)
        d['thumb_b64'] = load_optimized_b64(img_path, max_dim=160, quality=78)
        items.append(d)
        
    return items

def get_all_assets() -> dict:
    """Returns official logo, base assets, and the 24 seasonal blends."""
    assets = {
        "logo": load_optimized_b64(LOGO_PATH, max_dim=350, quality=85),
        "founders": [
            {
                "num": "01",
                "name": "ALMAIDAH CHAERUDIN PUTRI",
                "role": "Co-founder",
                "focus_id": "Pelopor hidrasi harian alami tanpa jalan pintas perisa sintetis.",
                "focus_en": "Championing honest daily hydration without synthetic shortcuts."
            },
            {
                "num": "02",
                "name": "ANNISHA HUMAIRA",
                "role": "Co-founder",
                "focus_id": "Perumus racikan bunga utuh yang selaras dengan ritme biologis tubuh dan musim.",
                "focus_en": "Formulating whole-flower blends aligned with seasonal body rhythms."
            },
            {
                "num": "03",
                "name": "JOHANA ABIGAEL RUMBIAK",
                "role": "Co-founder",
                "focus_id": "Penggagas ritual minum teh tanpa plastik dan ramah gaya hidup aktif.",
                "focus_en": "Shaping mindful, plastic-free rituals that fit active lifestyles."
            },
            {
                "num": "04",
                "name": "KEYLA PUTRI ADISTY",
                "role": "Co-founder",
                "focus_id": "Penggerak transparansi bahan baku dan edukasi khasiat botani yang jujur.",
                "focus_en": "Fostering radical transparency and honest ingredient education."
            },
            {
                "num": "05",
                "name": "NURSOLEHA ROMADHONI",
                "role": "Co-founder",
                "focus_id": "Penanggung jawab kemitraan langsung dengan petani lokal di Puncak, Garut & Wonosobo.",
                "focus_en": "Partnering directly with local growers across Puncak, Garut & Wonosobo."
            }
        ],
        "solar_terms": get_solar_terms_data()
    }
    return assets

if __name__ == "__main__":
    assets = get_all_assets()
    print(f"Loaded logo: {len(assets['logo'])} bytes")
    print(f"Loaded founders: {len(assets['founders'])} members")
    print(f"Loaded solar terms: {len(assets['solar_terms'])} products")
