from rembg import remove
from PIL import Image
import os

images = {
    r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Beldi\ezgif-frame-300.png": r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\nobg_products\Savon_noir_beldi_300.webp",
    r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Nila Soap.png": r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\nobg_products\Nila_Soap.webp"
}

for in_path, out_path in images.items():
    print(f"Processing {in_path}...")
    try:
        input_image = Image.open(in_path)
        print("Removing background...")
        output_image = remove(input_image)
        print("Saving as lossless WebP for maximum clarity and speed...")
        output_image.save(out_path, "WEBP", lossless=True)
        print(f"Saved optimized image to {out_path}")
    except Exception as e:
        print(f"Error processing {in_path}: {e}")
