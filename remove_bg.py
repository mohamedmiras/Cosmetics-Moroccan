from rembg import remove
from PIL import Image
import sys
import os

def process_folder(input_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    print(f"Processing images in {input_dir}...")
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, f"no-bg-{filename}")
            print(f"Removing background for {filename}...")
            try:
                input_image = Image.open(input_path)
                output_image = remove(input_image)
                output_image.save(output_path)
                print(f"Saved {output_path}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_bg.py <input_dir> <output_dir>")
        sys.exit(1)
        
    input_dir = sys.argv[1]
    output_dir = sys.argv[2]
    process_folder(input_dir, output_dir)
