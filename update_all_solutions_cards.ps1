$files = Get-ChildItem "d:\newgen gobal website starting\solution*.html" | Select-Object -ExpandProperty FullName

foreach ($file in $files) {
    $content = Get-Content $file -Raw

    # 1. Replace Control & SCADA Capabilities grid
    $oldScada = '(?s)<div style="display: grid; grid-template-columns: repeat\(auto-fit, minmax\(250px, 1fr\)\); gap: 20px; margin-bottom: 40px;">.*?<!-- Card 1 -->.*?<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba\(0,0,0,0\.05\);">.*?<h4 style="color: var\(--color-navy\); margin-bottom: 10px;">Control &amp; Automation Systems</h4>.*?<p style="font-size: 0\.95rem; color: #475569; margin-bottom: 10px; line-height: 1\.5;">Complete automation solutions designed around the process or machine requirement\.</p>.*?<p style="font-size: 0\.95rem; color: #475569; margin-bottom: 10px; line-height: 1\.5;">We integrate <strong>PLCs, remote I/O, drives, instrumentation, field devices, safety systems, industrial networks and control panels</strong> into a unified automation platform\.</p>.*?<p style="font-size: 0\.9rem; font-weight: 600; color: var\(--color-blue\); margin-bottom: 5px;">Applications:</p>.*?<p style="font-size: 0\.85rem; color: #475569; line-height: 1\.4;">Process automation .*? Machine control .*? Production lines .*? Utilities .*? Material handling .*? Plant automation</p>.*?</div>.*?<!-- Card 2 -->.*?<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba\(0,0,0,0\.05\);">.*?<h4 style="color: var\(--color-navy\); margin-bottom: 10px;">SCADA Systems</h4>.*?<p style="font-size: 0\.95rem; color: #475569; margin-bottom: 10px; line-height: 1\.5;">Centralized monitoring and supervisory control solutions that give operations teams visibility and control across machines, processes and plant utilities\.</p>.*?<p style="font-size: 0\.95rem; color: #475569; margin-bottom: 10px; line-height: 1\.5;">Our solutions can incorporate <strong>real-time visualization, alarms, trends, historical data, reporting and equipment status monitoring\.</strong></p>.*?<p style="font-size: 0\.9rem; font-weight: 600; color: var\(--color-blue\); margin-bottom: 5px;">Applications:</p>.*?<p style="font-size: 0\.85rem; color: #475569; line-height: 1\.4;">Plant monitoring .*? Utility monitoring .*? Process supervision .*? Production systems .*? Central control rooms</p>.*?</div>.*?</div>'

    $newScada = @"
<div class="panel-range-grid">
          <!-- Card 1 -->
          <div class="panel-card">
            <h4 class="panel-card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-blue-cta);"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              Control &amp; Automation Systems
            </h4>
            <p class="panel-card-desc">Complete automation solutions designed around the process or machine requirement.</p>
            <p class="panel-card-desc">We integrate <strong>PLCs, remote I/O, drives, instrumentation, field devices, safety systems, industrial networks and control panels</strong> into a unified automation platform.</p>
            <p class="panel-app-title">Applications</p>
            <div class="panel-tags">
              <span class="panel-tag">Process automation</span>
              <span class="panel-tag">Machine control</span>
              <span class="panel-tag">Production lines</span>
              <span class="panel-tag">Utilities</span>
              <span class="panel-tag">Material handling</span>
              <span class="panel-tag">Plant automation</span>
            </div>
          </div>
          <!-- Card 2 -->
          <div class="panel-card">
            <h4 class="panel-card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-blue-cta);"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              SCADA Systems
            </h4>
            <p class="panel-card-desc">Centralized monitoring and supervisory control solutions that give operations teams visibility and control across machines, processes and plant utilities.</p>
            <p class="panel-card-desc">Our solutions can incorporate <strong>real-time visualization, alarms, trends, historical data, reporting and equipment status monitoring.</strong></p>
            <p class="panel-app-title">Applications</p>
            <div class="panel-tags">
              <span class="panel-tag">Plant monitoring</span>
              <span class="panel-tag">Utility monitoring</span>
              <span class="panel-tag">Process supervision</span>
              <span class="panel-tag">Production systems</span>
              <span class="panel-tag">Central control rooms</span>
            </div>
          </div>
        </div>
"@

    $content = [regex]::Replace($content, $oldScada, $newScada)

    # 2. Replace single Application boxes
    $oldAppBox = '(?s)<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba\(0,0,0,0\.05\); margin-top: 30px; margin-bottom: 40px;">\s*<h4 style="color: var\(--color-navy\); margin-bottom: 10px;">(Typical )?Applications</h4>\s*<p style="font-size: 0\.95rem; color: #475569; line-height: 1\.6;">(.*?)</p>\s*</div>'

    $evaluator = [System.Text.RegularExpressions.MatchEvaluator] {
        param($match)
        $tags = $match.Groups[2].Value -split "\s*[^\w\s-&/]+\s*" | Where-Object { $_.Trim() -ne "" }
        $tagsHtml = $tags | ForEach-Object { "<span class=`"panel-tag`" style=`"background: #f1f5f9; color: var(--color-blue-cta); font-size: 0.8rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid #e2e8f0; display: inline-block; margin-right: 8px; margin-bottom: 8px;`">$($_.Trim())</span>" }
        $tagsHtml = $tagsHtml -join "`n            "
        
        return @"
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--color-navy); margin-top: 40px; margin-bottom: 15px;">Typical Applications:</h3>
          <div class="panel-tags">
            $tagsHtml
          </div>
"@
    }

    $content = [regex]::Replace($content, $oldAppBox, $evaluator)
    
    Set-Content $file $content
    Write-Host "Processed $file"
}
