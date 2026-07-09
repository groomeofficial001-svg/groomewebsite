import glob
import re

for file in glob.glob('*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace this exact block in the footer:
    # <a href="#top" class="brand"><img src="assets/logo.png" alt="Groome" /><span>Groome</span></a>
    
    # Regex to find any brand tag in the footer with logo.png
    # Specifically looking for: <img src="assets/logo.png" alt="Groome" /><span>Groome</span>
    pattern = r'<img\s+src="assets/logo\.png"\s+alt="Groome"\s*/>\s*<span>Groome</span>'
    replacement = r'<img src="assets/favicon.svg" alt="Groome" />'
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
