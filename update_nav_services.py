import os
import re

new_html = '''<div class="services-dropdown-list">
  <a href="services.html?modal=modal-service-mep" class="services-dropdown-item">
    <h5 class="services-dropdown-title">MEP Electrification Services</h5>
    <p class="services-dropdown-desc">Comprehensive industrial electrification.</p>
  </a>
  <a href="services.html?modal=modal-service-epc" class="services-dropdown-item">
    <h5 class="services-dropdown-title">EPC &amp; Master Systems Integration</h5>
    <p class="services-dropdown-desc">End-to-end turnkey automation projects.</p>
  </a>
  <a href="services.html?modal=modal-service-startup" class="services-dropdown-item">
    <h5 class="services-dropdown-title">Plant Start-up Services</h5>
    <p class="services-dropdown-desc">Expert commissioning and SAT/FAT.</p>
  </a>
  <a href="services.html?modal=modal-service-maintenance" class="services-dropdown-item">
    <h5 class="services-dropdown-title">Control System Maintenance</h5>
    <p class="services-dropdown-desc">24/7 preventive &amp; predictive support.</p>
  </a>
  <a href="services.html?modal=modal-service-tech" class="services-dropdown-item">
    <h5 class="services-dropdown-title">Technical Support Services</h5>
    <p class="services-dropdown-desc">Remote troubleshooting &amp; diagnostics.</p>
  </a>
  <a href="services.html?modal=modal-service-transformation" class="services-dropdown-item">
    <h5 class="services-dropdown-title">Manufacturing Transformation</h5>
    <p class="services-dropdown-desc">Industry 4.0 &amp; ITxOT convergence.</p>
  </a>
</div>'''

pattern = re.compile(r'<div class="services-dropdown-list">.*?</div>(?=\s*<div class="services-dropdown-footer">)', re.DOTALL)

for f in os.listdir('.'):
    if f.endswith('.html'):
        with open(f, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
        
        new_content = pattern.sub(new_html, content)
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Updated {f}')
