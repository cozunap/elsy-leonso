import os
import re

astro_files = []
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.astro'):
            astro_files.append(os.path.join(root, file))

for filepath in astro_files:
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Replace wp-content with assets
    content = content.replace('/wp-content/', '/assets/')
    
    # 2. Replace wp-includes with assets/includes
    content = content.replace('/wp-includes/', '/assets/includes/')
    
    # 3. Remove wp-emoji-loader script block entirely (it has a specific signature)
    content = re.sub(r'<script>[^<]*wp-emoji-settings.*?wp-emoji-loader\.min\.js\n</script>\n?', '', content, flags=re.DOTALL)
    
    # 4. Remove wp-emoji-settings template
    content = re.sub(r'<script type="text/javascript" id="wp-emoji-settings">.*?</script>\n?', '', content, flags=re.DOTALL)

    # 5. Remove Elementor JS configs
    content = re.sub(r'<script id="elementor-frontend-modules-js"[^>]*></script>\n?', '', content)
    content = re.sub(r'var elementorFrontendConfig = \{.*?\};\n?', '', content, flags=re.DOTALL)
    content = re.sub(r'var ElementorProFrontendConfig = \{.*?\};\n?', '', content, flags=re.DOTALL)

    # 6. We can remove Elementor frontend JS to prevent it from crashing (we already wrote custom slider JS)
    # Actually, we already removed Elementor frontend JS from index.astro? No, we didn't remove it from the other pages!
    content = re.sub(r'<script id="elementor-frontend-js"[^>]*></script>\n?', '', content)
    content = re.sub(r'<script id="elementor-pro-frontend-js"[^>]*></script>\n?', '', content)
    content = re.sub(r'<script id="elementor-webpack-runtime-js"[^>]*></script>\n?', '', content)
    content = re.sub(r'<script id="elementor-pro-webpack-runtime-js"[^>]*></script>\n?', '', content)

    with open(filepath, 'w') as f:
        f.write(content)

print(f"Processed {len(astro_files)} Astro files.")
