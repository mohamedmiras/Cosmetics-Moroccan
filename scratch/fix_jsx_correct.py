import os
import re

components_dir = r"d:\Miras Folder\Web Projects\LuxuryCommerce\src\components"

files = [
    "ProductDetails.jsx",
    "ProductDetailsBlue.jsx",
    "ProductDetailsChampagne.jsx",
    "ProductDetailsIndigo.jsx",
    "ProductDetailsLight.jsx",
    "ProductDetailsViolet.jsx"
]

def fix_file(filename):
    path = os.path.join(components_dir, filename)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # We want exactly two </div> before the inventory status bar
    # Currently it has only one </div> before `{/* Inventory Status Bar */}`:
    #                 +
    #               </button>
    #             </div>
    #             {/* Inventory Status Bar */}
    
    # Let's replace:
    #             </div>
    #             {/* Inventory Status Bar */}
    # with:
    #             </div>
    #           </div>
    #           {/* Inventory Status Bar */}
    
    pattern = r'(</button>\s*</div>)\s*(\{/\* Inventory Status Bar \*/\})'
    # Check if there is already a second </div>
    # If not, let's inject it.
    
    content = re.sub(pattern, r'\1\n            </div>\n            \2', content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

for file in files:
    fix_file(file)
    print(f"Ensured exactly two closing divs in {file}")
