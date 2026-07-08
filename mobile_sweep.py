import os

base = r'C:\Users\ashwi\Downloads\GROOME WEBSITE'
css_path = os.path.join(base, 'css', 'style.css')

mobile_optimizations = """
/* =========================================================
   COMPREHENSIVE MOBILE OPTIMIZATIONS (ADDED FOR FINAL SWEEP)
   ========================================================= */
@media (max-width: 900px) {
  /* Typography & Spacing */
  h1 { font-size: 2.5rem !important; line-height: 1.1 !important; }
  h2 { font-size: 2rem !important; }
  .lead { font-size: 1rem !important; }
  .section { padding: 60px 0 !important; }
  .section-head { margin-bottom: 30px !important; }

  /* Navbar / Mobile Menu Fixes */
  .nav-inner { 
    padding: 15px 20px !important;
  }
  .nav-links { 
    display: none !important; /* Hide standard links on mobile by default */
  }
  .nav-links.active {
    display: flex !important;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg);
    padding: 20px;
    box-shadow: var(--shadow-md);
    border-radius: 0 0 20px 20px;
    gap: 15px;
  }
  .nav-cta .btn-ghost { display: none !important; } /* Hide secondary button in header */
  
  /* Grids & Layouts - Force 1 Column */
  .hero-grid, .benefits-grid, .team-grid, .journey-grid, .contact-grid, .features-grid, .dashboard, .dashboard-grid, .footer-grid, .pricing-grid, .cine-scene, .story-stage {
    grid-template-columns: 1fr !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 30px !important;
  }
  
  /* Hero Section */
  .hero { min-height: auto !important; padding: 100px 0 60px !important; text-align: center; }
  .hero-content { align-items: center !important; text-align: center !important; margin: 0 auto !important; }
  .hero-visual { display: flex; justify-content: center; }
  .float-card { position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; margin: 10px 0 !important; transform: none !important; animation: none !important; width: 100% !important; max-width: 300px; }
  
  /* Form inputs & buttons */
  input, select, textarea, .btn {
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .btn { padding: 16px 20px !important; justify-content: center; }
  
  /* Footer */
  .footer { padding: 60px 0 30px !important; }
  .footer-bottom { flex-direction: column; text-align: center; gap: 15px; }

  /* Journey cinematic */
  .cine-scene { padding: 40px 20px !important; align-items: center !important; }
  .cine-content { text-align: center !important; margin-bottom: 20px; }
  .cine-visual { min-height: 200px; }
}

@media (max-width: 400px) {
  h1 { font-size: 2rem !important; }
  h2 { font-size: 1.8rem !important; }
}
"""

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

if 'COMPREHENSIVE MOBILE OPTIMIZATIONS' not in css:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write('\n' + mobile_optimizations)
    print("Mobile optimizations appended to CSS.")

# Cache bust HTML
html_files = [f for f in os.listdir(base) if f.endswith('.html')]
for f in html_files:
    path = os.path.join(base, f)
    with open(path, 'r', encoding='utf-8') as file:
        html = file.read()
    
    html = html.replace('css/style.css?v=2.6', 'css/style.css?v=2.7')
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(html)
