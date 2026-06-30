from PIL import Image

img = Image.open(r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Savor Noir Nila.png")
pixels = img.load()
width, height = img.size
print(f"Top-Left corner: {pixels[0, 0]}")
print(f"Top-Right corner: {pixels[width-1, 0]}")
print(f"Center: {pixels[width//2, height//2]}")
