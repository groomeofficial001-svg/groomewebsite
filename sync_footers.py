import re

def update_footer(filepath, full_footer):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace anything between <footer class="footer"> and </footer>
    new_content = re.sub(r'<footer class="footer">.*?</footer>', full_footer, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated footer in {filepath}")

if __name__ == '__main__':
    with open('index.html', 'r', encoding='utf-8') as f:
        idx_content = f.read()
        
    match = re.search(r'<footer class="footer">.*?</footer>', idx_content, flags=re.DOTALL)
    if match:
        full_footer = match.group(0)
        update_footer('privacy.html', full_footer)
        update_footer('terms.html', full_footer)
    else:
        print("Footer not found in index.html")
