import os
import re

base = r'C:\Users\ashwi\Downloads\GROOME WEBSITE'
html_files = [f for f in os.listdir(base) if f.endswith('.html')]
for f in html_files:
    with open(os.path.join(base, f), 'r', encoding='utf-8') as file:
        content = file.read()
        buttons = re.findall(r'<a[^>]*class="[^"]*btn[^"]*"[^>]*>.*?</a>', content, re.IGNORECASE)
        print(f'--- {f} ---')
        for b in buttons:
            print(b.replace('\u2192', '->'))
        # Also check normal buttons
        buttons2 = re.findall(r'<button[^>]*>.*?</button>', content, re.IGNORECASE)
        for b in buttons2:
            print(b.replace('\u2192', '->'))
