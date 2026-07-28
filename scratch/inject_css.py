import os
import re

astro_files = []
for root, _, files in os.walk('src/pages'):
    for file in files:
        if file.endswith('.astro'):
            astro_files.append(os.path.join(root, file))

for filepath in astro_files:
    with open(filepath, 'r') as f:
        content = f.read()

    if "import '../styles/fixes.css';" not in content:
        # Find the end of the frontmatter imports
        content = content.replace("---\n", "---\nimport '../styles/fixes.css';\n", 1)
        
        with open(filepath, 'w') as f:
            f.write(content)

print(f"Processed {len(astro_files)} pages.")
