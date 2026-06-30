from PIL import Image

in_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Beldi\ezgif-frame-300.png"
out_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Beldi\ezgif-frame-300-hd.webp"

try:
    input_image = Image.open(in_path)
    input_image.save(out_path, "WEBP", lossless=True)
    print(f"Saved HD WebP without background removal to {out_path}")
except Exception as e:
    print(f"Error: {e}")
