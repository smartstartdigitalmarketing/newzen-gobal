import re

with open('products.html', 'r', encoding='utf-8') as f:
    content = f.read()

card_regex = r'(?s)<div class="product-img-card" onclick="openContentModal\(''modal-([^'']+)'(.*?)<img src="([^"]+)".*?<h3 class="product-card-title">(.*?)</h3>'
matches = re.finditer(card_regex, content)

for match in matches:
    page_base = match.group(1)
    modal_id = 'modal-' + page_base
    inner_page = page_base + '.html'
    image = match.group(3)
    title = match.group(4)
    
    try:
        with open(inner_page, 'r', encoding='utf-8') as inner_f:
            inner_content = inner_f.read()
            
        overview = ''
        overview_match = re.search(r'(?s)<div class="detail-overview-col">(.*?)</section>', inner_content)
        if not overview_match:
            overview_match = re.search(r'(?s)<div class="detail-overview-col">(.*?)</div>\s*<!-- RIGHT:', inner_content)
            
        if overview_match:
            overview = overview_match.group(1)
            overview = re.sub(r'(?s)<div class="sticky-contact-card.*', '', overview)
            
        modal_replacement = f"""<div class="content-modal-overlay" id="{modal_id}">
  <div class="content-modal-box">
    <button class="content-modal-close" onclick="closeContentModal('{modal_id}')">&times;</button>
    <div class="content-modal-left">
      <img src="{image}" alt="{title}">
    </div>
    <div class="content-modal-right">
      <h2 class="content-modal-title">{title}</h2>
      <div class="content-modal-body">
        {overview}
      </div>
    </div>
  </div>
</div>"""
        
        modal_pattern = rf'(?s)<div class="content-modal-overlay" id="{modal_id}">.*?</div>\s*</div>\s*</div>'
        content = re.sub(modal_pattern, modal_replacement, content)
        
    except Exception as e:
        print(f"Error on {inner_page}: {e}")

with open('products.html', 'w', encoding='utf-8') as f:
    f.write(content)
