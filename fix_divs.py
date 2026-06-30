import os
import re

components_dir = r"d:\Miras Folder\Web Projects\LuxuryCommerce\src\components"
files_to_modify = [
    "ProductDetails.jsx",
    "ProductDetailsLight.jsx",
    "ProductDetailsViolet.jsx",
    "ProductDetailsBlue.jsx",
    "ProductDetailsIndigo.jsx",
    "ProductDetailsChampagne.jsx"
]

for filename in files_to_modify:
    filepath = os.path.join(components_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the trailing </div>s with exactly 6 </div>s.
    content = re.sub(r'(</div>\s*)+(\);\s*};)', r'</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  \2', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {filename}")
