import os
import re

components_dir = r"d:\Miras Folder\Web Projects\LuxuryCommerce\src\components"

file_key_map = {
    "ProductDetails.jsx": "crimson-rose",
    "ProductDetailsBlue.jsx": "moroccan-nila-soap",
    "ProductDetailsChampagne.jsx": "aker-fassi-powder",
    "ProductDetailsIndigo.jsx": "savon-noir-a-nila",
    "ProductDetailsLight.jsx": "moroccan-lip-pot",
    "ProductDetailsViolet.jsx": "savon-beldi"
}

def update_file(filename, db_key):
    path = os.path.join(components_dir, filename)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the increment button and add disabled prop
    inc_btn_pattern = r'(<button\s+onClick=\{\(\) => increment\([^)]+\)\}[^>]+)>'
    content = re.sub(inc_btn_pattern, r'\1 disabled={isOutOfStock || count >= availableQty}>', content)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

for file, key in file_key_map.items():
    update_file(file, key)
    print(f"Updated disabled prop in {file}")
