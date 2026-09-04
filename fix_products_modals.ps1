$file = "d:\newgen gobal website starting\products.html"
$content = Get-Content $file -Raw

# Since products.html already has the modals injected (but with wrong image and empty body),
# we will rebuild the modals completely by parsing the cards in products.html.
# Wait, let's just find the cards, get the image from the card, the title, and then the overview from inner page.

$modalsHtml = ""
$cardRegex = '(?s)<div class="product-img-card" onclick="openContentModal\(''modal-([^'']+)'(.*?)<img src="([^"]+)".*?<h3 class="product-card-title">(.*?)</h3>'
$matches = [regex]::Matches($content, $cardRegex)

foreach ($match in $matches) {
    $modalId = "modal-" + $match.Groups[1].Value
    $innerPage = $match.Groups[1].Value + ".html"
    $image = $match.Groups[3].Value
    $title = $match.Groups[4].Value
    
    $innerContent = Get-Content "d:\newgen gobal website starting\$innerPage" -Raw
    
    $overview = ""
    # Look for "RIGHT: Sticky Inquiry Form"
    $overviewMatch = [regex]::Match($innerContent, '(?s)<div class="detail-overview-col">(.*?)</div>\s*<!-- RIGHT:')
    if ($overviewMatch.Success) { 
        $overview = $overviewMatch.Groups[1].Value 
    } else {
        # Fallback
        $overviewMatch2 = [regex]::Match($innerContent, '(?s)<div class="detail-overview-col">(.*?)</section>')
        if ($overviewMatch2.Success) {
            $overview = $overviewMatch2.Groups[1].Value
            $overview = [regex]::Replace($overview, '(?s)<div class="sticky-contact-card.*', '')
        }
    }
    
    # Replace the existing modal in $content
    $content = [regex]::Replace($content, "(?s)<div class=`"content-modal-overlay`" id=`"$modalId`">.*?</div>\s*</div>\s*</div>", @"
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
    )
}

Set-Content $file $content
