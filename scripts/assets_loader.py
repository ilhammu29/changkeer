#!/usr/bin/env python3
"""
assets_loader.py - Helper to optimize and encode images for PDF generation
"""
import os
import io
import base64
from PIL import Image

BASE_DIR = "/home/ilhammu29/changkeer"

def load_optimized_b64(path: str, max_dim: int = 700, quality: int = 82) -> str:
    """Loads an image, scales it proportionally, and returns a base64 JPEG string."""
    if not os.path.exists(path):
        return ""
    try:
        im = Image.open(path)
        im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
        if im.mode in ('RGBA', 'P'):
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

def get_all_assets() -> dict:
    """Returns a dictionary of all base64-encoded visual assets."""
    assets = {
        "logo": load_optimized_b64(os.path.join(BASE_DIR, "public/images/logo_changkeer.jpg"), max_dim=400),
        "jasmine": load_optimized_b64(os.path.join(BASE_DIR, "assets-changker/jasmine_tea_produk.png"), max_dim=600),
        "vanilla_mint": load_optimized_b64(os.path.join(BASE_DIR, "assets-changker/vanilla_mint_tea_produk.jpg"), max_dim=600),
        "english_breakfast": load_optimized_b64(os.path.join(BASE_DIR, "assets-changker/english_breakfast_tea_produk.jpg"), max_dim=600),
        "spring": load_optimized_b64(os.path.join(BASE_DIR, "assets-changker/24_product_season/Start of Spring.jpg"), max_dim=600),
        "summer": load_optimized_b64(os.path.join(BASE_DIR, "assets-changker/24_product_season/Summer Solstice.jpg"), max_dim=600),
        "autumn": load_optimized_b64(os.path.join(BASE_DIR, "assets-changker/24_product_season/Autumn Equinox.jpg"), max_dim=600),
        "winter": load_optimized_b64(os.path.join(BASE_DIR, "assets-changker/24_product_season/Winter Solstice.jpg"), max_dim=600),
        "qris": load_optimized_b64("/home/ilhammu29/barcode_pembayaran.jpeg", max_dim=500),
    }
    return assets

if __name__ == "__main__":
    assets = get_all_assets()
    for k, v in assets.items():
        print(f"Asset '{k}': length {len(v)} bytes")
