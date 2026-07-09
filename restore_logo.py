import glob
import re

for file in glob.glob('*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace favicon.svg in the navbar/footer brand links back to logo.png
    new_content = content.replace('src="assets/favicon.svg" alt="Groome"', 'src="assets/logo.png" alt="Groome"')
    
    # If the user wanted to remove the "Groome" text in the navbar, we leave it removed.
    # The previous script removed <span>Groome</span> from the footer, which is fine.
    # The navbar HTML currently doesn't have <span>Groome</span> if I removed it earlier.
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Restored logo.png in {file}")
