from PIL import Image
import os

in_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Savon_noir.png"
out_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Savon_noir_hd.webp"

try:
    print(f"Converting {in_path} to WebP...")
    img = Image.open(in_path)
    img.save(out_path, "WEBP", lossless=True)
    print(f"Saved HD WebP to {out_path}")
except Exception as e:
    print(f"Error: {e}")
