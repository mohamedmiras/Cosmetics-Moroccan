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

    # 1. Update imports
    content = content.replace("import React, { useEffect, useRef, useState } from 'react';", 
                              "import React, { useEffect, useRef } from 'react';\nimport { useCart } from '../context/CartContext';")
    
    # 2. Update hooks
    content = re.sub(
        r"const textGroupRef = useRef\(null\);\n\s*const \[count, setCount\] = useState\(1\);",
        r"const textGroupRef = useRef(null);\n  const { increment, decrement, getQuantity } = useCart();\n  const count = getQuantity(activeProduct.id);",
        content
    )

    # 3. Remove handleDecrement and handleIncrement
    content = re.sub(
        r"\s*const handleDecrement = \(\) => \{[\s\S]*?\};\n\n\s*const handleIncrement = \(\) => \{[\s\S]*?\};\n",
        "\n",
        content
    )

    # 4. Replace the controls block (everything from <div className="flex items-center gap-4 w-full justify-center"> to the end of the flex-col gap-5 block)
    # Because each file has different hover colors in the Add to Cart button and Total Amount block, we use regex to match the whole block.
    
    pattern = r'(<div className="flex flex-col gap-5 w-full max-w-md mx-auto md:mx-0">)[\s\S]*?(</div>\s*</div>\s*</div>)'
    
    replacement = r'''\1
            <div className="flex items-center gap-4 w-full justify-center md:justify-start">
              <div className="flex items-center justify-between border border-[#3a2522]/10 dark:border-white/10 rounded-full px-4 py-3 min-w-[150px] bg-white/30 dark:bg-white/5 backdrop-blur-sm transform-gpu transition-colors duration-500">
                <button 
                  onClick={() => decrement(activeProduct.id)}
                  className="text-[#3a2522]/50 hover:text-[#3a2522] dark:text-white/50 dark:hover:text-white text-2xl transition-colors w-10 h-10 flex items-center justify-center disabled:opacity-30 disabled:hover:text-[#3a2522]/50 dark:disabled:hover:text-white/50"
                  disabled={count === 0}
                >
                  -
                </button>
                <span className="text-[#3a2522] dark:text-white font-light text-xl min-w-[30px] text-center transition-colors duration-500">{count}</span>
                <button 
                  onClick={() => increment(activeProduct.id, activeProduct.price, activeProduct.name)}
                  className="text-[#3a2522]/50 hover:text-[#3a2522] dark:text-white/50 dark:hover:text-white text-2xl transition-colors w-10 h-10 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
\2'''

    content = re.sub(pattern, replacement, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
