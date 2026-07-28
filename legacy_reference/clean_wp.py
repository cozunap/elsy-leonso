import os
import re

files_to_process = [
    'index.html',
    'about-us/index.html',
    'services/index.html',
    'insurance/index.html',
    'contact-us/index.html'
]

def clean_html(content):
    # Emojis
    content = re.sub(r'<script[^>]*id="wp-emoji-settings"[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<style[^>]*id="wp-emoji-styles-[^>]*>.*?</style>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script[^>]*wp-emoji-release[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script[^>]*wp-emoji-loader[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    
    # REST API & oEmbed
    content = re.sub(r'<link[^>]*rel="alternate"[^>]*wp-json[^>]*>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<link[^>]*rel="alternate"[^>]*oembed[^>]*>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<link[^>]*rel="https://api.w.org/"[^>]*>', '', content, flags=re.IGNORECASE)
    
    # RSD / WLW / EditURI
    content = re.sub(r'<link[^>]*rel="EditURI"[^>]*>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<link[^>]*rel="wlwmanifest"[^>]*>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<link[^>]*rel="pingback"[^>]*>', '', content, flags=re.IGNORECASE)
    
    # Generator
    content = re.sub(r'<meta[^>]*name="generator"[^>]*content="WordPress[^>]*>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<meta[^>]*name="generator"[^>]*content="Elementor[^>]*>', '', content, flags=re.IGNORECASE)
    
    # Embed script
    content = re.sub(r'<script[^>]*wp-embed\.min\.js[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    
    # Remove wp-embed-responsive class
    content = re.sub(r'(\sclass="[^"]*)wp-embed-responsive([^"]*")', r'\1\2', content)
    
    # Clean up empty lines left by regex
    content = re.sub(r'\n\s*\n', '\n', content)
    
    return content

for filepath in files_to_process:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
            
        cleaned = clean_html(html)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        print(f"Cleaned {filepath}")
    else:
        print(f"File not found: {filepath}")
