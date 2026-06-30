from rembg import remove
from PIL import Image

in_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Savor Noir Nila.png"
out_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\nobg_products\Savor_Noir_Nila_nobg.webp"

try:
    print(f"Opening {in_path}...")
    input_image = Image.open(in_path)
    print("Removing background...")
    output_image = remove(input_image)
    print("Saving as WebP...")
    output_image.save(out_path, "webp", quality=85, optimize=True)
    print(f"Successfully saved to {out_path}")
except Exception as e:
    print(f"Error: {e}")
