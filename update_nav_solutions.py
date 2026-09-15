import os
import re

new_html = '''<div class="solutions-dropdown-list">
  <a href="solutions.html?modal=modal-solution-integrated-electric-systems" class="solutions-dropdown-item">
    <h5 class="solutions-dropdown-title">Integrated Electric Systems</h5>
    <p class="solutions-dropdown-desc">Engineered Electrical Systems for Reliable Industrial Operations.</p>
  </a>
  <a href="solutions.html?modal=modal-solution-integrated-control-systems" class="solutions-dropdown-item">
    <h5 class="solutions-dropdown-title">Integrated Control Systems</h5>
    <p class="solutions-dropdown-desc">Bringing Machines, Processes and Plant Operations Under Intelligent Control.</p>
  </a>
  <a href="solutions.html?modal=modal-solution-visualization-systems" class="solutions-dropdown-item">
    <h5 class="solutions-dropdown-title">Integrated Visualization Systems</h5>
    <p class="solutions-dropdown-desc">Turning Plant Data into Operational Visibility.</p>
  </a>
  <a href="solutions.html?modal=modal-solution-feeding-dosing-systems" class="solutions-dropdown-item">
    <h5 class="solutions-dropdown-title">Feeding &amp; Dosing Systems</h5>
    <p class="solutions-dropdown-desc">Bespoke engineered systems for accurate material feeding and dispensing.</p>
  </a>
  <a href="solutions.html?modal=modal-solution-intralogistics-systems" class="solutions-dropdown-item">
    <h5 class="solutions-dropdown-title">Integrated Intralogistics Systems</h5>
    <p class="solutions-dropdown-desc">Automating Material Movement Within Your Facility.</p>
  </a>
  <a href="solutions.html?modal=modal-solution-inspection-systems" class="solutions-dropdown-item">
    <h5 class="solutions-dropdown-title">Integrated Inspection Systems</h5>
    <p class="solutions-dropdown-desc">Automated Inspection for Quality, Accuracy and Traceability.</p>
  </a>
</div>'''

pattern = re.compile(r'<div class="solutions-dropdown-list">.*?</div>(?=\s*<div class="solutions-dropdown-footer">)', re.DOTALL)

for f in os.listdir('.'):
    if f.endswith('.html'):
        with open(f, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
        
        new_content = pattern.sub(new_html, content)
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Updated {f}')
