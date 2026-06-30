import os
import glob
from PIL import Image

input_dir = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Beldi"
output_dir = r"d:\Miras Folder\Web Projects\LuxuryCommerce\public\Videos\product_visuals\Beldi_Webp"

os.makedirs(output_dir, exist_ok=True)

frames = sorted(glob.glob(os.path.join(input_dir, "ezgif-frame-*.png")))

# Take every 5th frame, but skip the first 150 frames (first 5 seconds approx)
selected_frames = frames[150::5]

for i, frame_path in enumerate(selected_frames):
    img = Image.open(frame_path)
    # Convert RGBA to keep transparency in WebP
    output_filename = f"frame-{i+1:03d}.webp"
    output_path = os.path.join(output_dir, output_filename)
    img.save(output_path, "WEBP", quality=85)
    if i % 10 == 0:
        print(f"Processed {i} frames...")
print("Done converting Beldi sequence to WebP!")
