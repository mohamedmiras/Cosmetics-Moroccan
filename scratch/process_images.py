import os
from rembg import remove
from PIL import Image

input_dir = 'public/Videos/product_visuals'
output_dir = 'public/nobg_products'

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# List of files to process
files = [
    "Akera Fasi Powder.webp",
    "Aleovera Soap.jpg",
    "Blue Soap.jpg",
    "Cowrie Shell.jpg",
    "Frankincense Soap.jpg",
    "Moroccan_lip_pot.png",
    "Rose Water.jpg",
    "Savon Beldi Aker Fasi.jpg",
    "Savon Beldi Lavendre.jpg",
    "Savon Beldi Nila.jpg",
    "Savor_Noir_Nila Powder.webp"
]

print(f"Processing {len(files)} images...")

for filename in files:
    input_path = os.path.join(input_dir, filename)
    
    # Create webp output name
    basename = os.path.splitext(filename)[0]
    # Clean up name for web (lowercase, replace spaces with hyphens)
    clean_name = basename.lower().replace(' ', '-').replace('_', '-')
    output_filename = f"{clean_name}-nobg.webp"
    output_path = os.path.join(output_dir, output_filename)
    
    if os.path.exists(output_path):
        print(f"Skipping {filename} -> already exists as {output_filename}")
        continue
        
    print(f"Processing {filename} -> {output_filename}")
    
    try:
        with open(input_path, 'rb') as i:
            input_data = i.read()
            
        # Remove background
        output_data = remove(input_data)
        
        # We need to save as webp, remove output_data is raw bytes of a PNG
        # So we write to a temp file, open with PIL, then save as webp
        temp_path = os.path.join(output_dir, "temp.png")
        with open(temp_path, 'wb') as o:
            o.write(output_data)
            
        img = Image.open(temp_path)
        img.save(output_path, "webp", quality=90)
        os.remove(temp_path)
        
        print(f"Success: {output_filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Done processing images!")
