$file = "d:\newgen gobal website starting\solutions.html"
$content = Get-Content $file -Raw

$matches = [regex]::Matches($content, 'onclick="openContentModal\(''modal-([^'']+)''\)"')

foreach ($match in $matches) {
    $innerPage = $match.Groups[1].Value + ".html"
    $modalId = "modal-" + $match.Groups[1].Value
    
    $innerContent = Get-Content "d:\newgen gobal website starting\$innerPage" -Raw
    
    $overview = ""
    # Try looking for "RIGHT: Sticky Inquiry Form"
    $overviewMatch = [regex]::Match($innerContent, '(?s)<div class="detail-overview-col">(.*?)</div>\s*<!-- RIGHT:')
    if ($overviewMatch.Success) { 
        $overview = $overviewMatch.Groups[1].Value 
    } else {
        # Fallback if comment is slightly different
        $overviewMatch2 = [regex]::Match($innerContent, '(?s)<div class="detail-overview-col">(.*?)</section>')
        if ($overviewMatch2.Success) {
            $overview = $overviewMatch2.Groups[1].Value
            $overview = [regex]::Replace($overview, '(?s)<div class="sticky-contact-card.*', '')
        }
    }

    # Now replace the empty `<div class="content-modal-body"></div>` with the new overview in the file
    $content = [regex]::Replace($content, "(?s)(<div class=`"content-modal-overlay`" id=`"$modalId`">.*?<div class=`"content-modal-body`">)\s*(</div>)", "`$1`n        $overview`n      `$2")
}

Set-Content $file $content
