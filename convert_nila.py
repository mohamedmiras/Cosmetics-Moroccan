from PIL import Image

in_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Savor Noir Nila.png"
out_path = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Savor_Noir_Nila_hd.webp"

try:
    img = Image.open(in_path)
    img.save(out_path, "webp", quality=85, optimize=True)
    print("Successfully converted Savor Noir Nila to WebP")
except Exception as e:
    print(f"Error: {e}")
