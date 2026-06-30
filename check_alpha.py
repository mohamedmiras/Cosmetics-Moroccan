from PIL import Image
import numpy as np

img = Image.open(r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Savor Noir Nila.png")
if img.mode == 'RGBA':
    data = np.array(img)
    alpha = data[:, :, 3]
    if np.any(alpha < 255):
        print("Image HAS transparency")
    else:
        print("Image does NOT have transparency")
else:
    print(f"Image mode is {img.mode}, does NOT have transparency")
