$file = "d:\newgen gobal website starting\products.html"
$content = Get-Content $file -Raw

$cardRegex = '(?s)<div class="product-img-card" onclick="openContentModal\(''modal-([^'']+)''\)"(.*?)<img src="([^"]+)".*?<h3 class="product-card-title">(.*?)</h3>'
$matches = [regex]::Matches($content, $cardRegex)

foreach ($match in $matches) {
    $pageBase = $match.Groups[1].Value
    $modalId = "modal-" + $pageBase
    $innerPage = $pageBase + ".html"
    $image = $match.Groups[3].Value
    $title = $match.Groups[4].Value
    
    $innerContent = Get-Content "d:\newgen gobal website starting\$innerPage" -Raw
    
    $overview = ""
    $overviewMatch = [regex]::Match($innerContent, '(?s)<div class="detail-overview-col">(.*?)</section>')
    if (-not $overviewMatch.Success) {
        $overviewMatch = [regex]::Match($innerContent, '(?s)<div class="detail-overview-col">(.*?)</div>\s*<!-- RIGHT:')
    }
    
    if ($overviewMatch.Success) {
        $overview = $overviewMatch.Groups[1].Value
        $overview = [regex]::Replace($overview, '(?s)<div class="sticky-contact-card.*', '')
    }
    
    $modalReplacement = "<div class=`"content-modal-overlay`" id=`"$modalId`">`n" +
"  <div class=`"content-modal-box`">`n" +
"    <button class=`"content-modal-close`" onclick=`"closeContentModal('$modalId')`">&times;</button>`n" +
"    <div class=`"content-modal-left`">`n" +
"      <img src=`"$image`" alt=`"$title`">`n" +
"    </div>`n" +
"    <div class=`"content-modal-right`">`n" +
"      <h2 class=`"content-modal-title`">$title</h2>`n" +
"      <div class=`"content-modal-body`">`n" +
"        $overview`n" +
"      </div>`n" +
"    </div>`n" +
"  </div>`n" +
"</div>"

    $modalPattern = '(?s)<div class="content-modal-overlay" id="' + $modalId + '">.*?</div>\s*</div>\s*</div>'
    $content = [regex]::Replace($content, $modalPattern, $modalReplacement)
}

Set-Content $file $content
