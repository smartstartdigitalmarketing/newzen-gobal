$file = "d:\newgen gobal website starting\solutions.html"
$content = Get-Content $file -Raw

$matches = [regex]::Matches($content, 'onclick="openContentModal\(''modal-([^'']+)''\)"')
$modalsHtml = ""

foreach ($match in $matches) {
    $innerPage = $match.Groups[1].Value + ".html"
    $modalId = "modal-" + $match.Groups[1].Value
    
    # Don't inject if this modal already exists
    if ($content -match "id=`"$modalId`"") { continue }
    
    $innerContent = Get-Content "d:\newgen gobal website starting\$innerPage" -Raw
    
    $image = ""
    $title = ""
    $overview = ""
    
    $imgMatch = [regex]::Match($innerContent, 'url\(''([^'']+)''\)')
    if ($imgMatch.Success) { $image = $imgMatch.Groups[1].Value }

    $titleMatch = [regex]::Match($innerContent, '<h1 class="detail-hero-title">(.*?)</h1>')
    if ($titleMatch.Success) { $title = $titleMatch.Groups[1].Value }
    
    $overviewMatch = [regex]::Match($innerContent, '(?s)<div class="detail-overview-col">(.*?)</div>\s*<!-- Right Column')
    if ($overviewMatch.Success) { 
        $overview = $overviewMatch.Groups[1].Value 
        $overview = [regex]::Replace($overview, '(?s)<div class="detail-cta-row".*?</div>', '')
        $overview = [regex]::Replace($overview, '(?s)<div class="sticky-contact-card.*', '')
    }

    $modalsHtml += @"
<div class="content-modal-overlay" id="$modalId">
  <div class="content-modal-box">
    <button class="content-modal-close" onclick="closeContentModal('$modalId')">&times;</button>
    <div class="content-modal-left">
      <img src="$image" alt="$title">
    </div>
    <div class="content-modal-right">
      <h2 class="content-modal-title">$title</h2>
      <div class="content-modal-body">
        $overview
      </div>
    </div>
  </div>
</div>
"@
}

$content = $content -replace '<div id="modals-container"></div>', "<div id=`"modals-container`">`n$modalsHtml`n</div>"
Set-Content $file $content
