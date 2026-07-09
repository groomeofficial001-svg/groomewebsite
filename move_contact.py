import glob
import re

for file in glob.glob('*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to move Contact from Legal to Company
    # The structure looks like this:
    #         <div class="foot-col">
    #           <h5>Company</h5>
    #           <a href="journey.html">About Groome</a>
    #           <a href="join.html">Careers</a>
    #         </div>
    #         <div class="foot-col">
    #           <h5>Legal</h5>
    #           <a href="privacy.html">Privacy Policy</a>
    #           <a href="terms.html">Terms &amp; Conditions</a>
    #           <a href="mailto:groomeofficial001@gmail.com">Contact</a>
    #         </div>
    
    # First, let's remove Contact from Legal
    new_content = content.replace('<a href="mailto:groomeofficial001@gmail.com">Contact</a>\n        </div>\n      </div>\n      <div class="foot-bottom">', '</div>\n      </div>\n      <div class="foot-bottom">')
    
    # If the exact match above failed because of spacing, let's use regex
    pattern_legal = r'(<h5>Legal</h5>\s*<a href="privacy\.html">Privacy Policy</a>\s*<a href="terms\.html">Terms &amp; Conditions</a>)\s*<a href="mailto:groomeofficial001@gmail\.com">Contact</a>'
    new_content = re.sub(pattern_legal, r'\1', content)
    
    pattern_company = r'(<h5>Company</h5>\s*<a href="journey\.html">About Groome</a>\s*<a href="join\.html">Careers</a>)'
    new_content = re.sub(pattern_company, r'\1\n          <a href="mailto:groomeofficial001@gmail.com">Contact</a>', new_content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Moved Contact to Company in {file}")
