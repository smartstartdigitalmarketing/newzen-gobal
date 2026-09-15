import os
import re

new_html = '''<div class="products-dropdown-list">
  <a href="products.html?modal=modal-product-electrical-components" class="products-dropdown-item">
    <h5 class="products-dropdown-title">Electrical Components</h5>
    <p class="products-dropdown-desc">Safe and efficient industrial power distribution.</p>
  </a>
  <a href="products.html?modal=modal-product-electrical-infrastructure" class="products-dropdown-item">
    <h5 class="products-dropdown-title">Electrical Infrastructure &amp; Accessories</h5>
    <p class="products-dropdown-desc">Reliable power distribution and cable management.</p>
  </a>
  <a href="products.html?modal=modal-product-control-components" class="products-dropdown-item">
    <h5 class="products-dropdown-title">Control Components</h5>
    <p class="products-dropdown-desc">Keep machines and processes operating efficiently.</p>
  </a>
  <a href="products.html?modal=modal-product-field-elements" class="products-dropdown-item">
    <h5 class="products-dropdown-title">Field Elements</h5>
    <p class="products-dropdown-desc">Connecting real-world conditions to control systems.</p>
  </a>
  <a href="products.html?modal=modal-product-digital-elements" class="products-dropdown-item">
    <h5 class="products-dropdown-title">Digital Elements</h5>
    <p class="products-dropdown-desc">Visibility, intelligence and connectivity for operations.</p>
  </a>
  <a href="products.html?modal=modal-product-industrial-software" class="products-dropdown-item">
    <h5 class="products-dropdown-title">Industrial Software</h5>
    <p class="products-dropdown-desc">Turn industrial data into actionable information.</p>
  </a>
  <a href="products.html?modal=modal-product-industrial-network" class="products-dropdown-item">
    <h5 class="products-dropdown-title">Industrial Network &amp; Infrastructure</h5>
    <p class="products-dropdown-desc">Reliable connectivity from field to enterprise networks.</p>
  </a>
  <a href="products.html?modal=modal-product-automation-modules" class="products-dropdown-item">
    <h5 class="products-dropdown-title">Automation Modules &amp; Systems</h5>
    <p class="products-dropdown-desc">Functional units that automate material and production.</p>
  </a>
</div>'''

pattern = re.compile(r'<div class="products-dropdown-list">.*?</div>(?=\s*<div class="products-dropdown-footer">)', re.DOTALL)

for f in os.listdir('.'):
    if f.endswith('.html'):
        with open(f, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
        
        new_content = pattern.sub(new_html, content)
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Updated {f}')
