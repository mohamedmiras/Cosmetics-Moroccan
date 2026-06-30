from PIL import Image

in_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Lessara.png"
out_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Lessara_hd.webp"

try:
    print(f"Converting {in_path} to WebP...")
    img = Image.open(in_path)
    img.save(out_path, "WEBP", lossless=True)
    print(f"Saved HD WebP to {out_path}")
except Exception as e:
    print(f"Error: {e}")
