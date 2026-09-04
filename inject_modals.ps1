$htmlFiles = @(
    @{ File = 'products.html' },
    @{ File = 'solutions.html' }
)

foreach ($fileInfo in $htmlFiles) {
    $file = "d:\newgen gobal website starting\$($fileInfo.File)"
    $content = Get-Content $file -Raw

    $modalStylesAndScripts = @"
    <style>
      .content-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(11, 25, 44, 0.85); z-index: 9999;
        display: none; justify-content: center; align-items: center;
        opacity: 0; transition: opacity 0.3s ease; padding: 20px;
      }
      .content-modal-overlay.active { display: flex; opacity: 1; }
      .content-modal-box {
        background: #fff; width: 100%; max-width: 1200px; max-height: 90vh;
        border-radius: 12px; overflow: hidden; display: flex; flex-direction: row;
        box-shadow: 0 25px 50px rgba(0,0,0,0.25); position: relative;
        transform: translateY(20px); transition: transform 0.3s ease;
      }
      .content-modal-overlay.active .content-modal-box { transform: translateY(0); }
      .content-modal-left { width: 45%; background: #f8fafc; position: relative; flex-shrink: 0; }
      .content-modal-left img { width: 100%; height: 100%; object-fit: cover; }
      .content-modal-right { width: 55%; padding: 50px; overflow-y: auto; max-height: 90vh; }
      .content-modal-close {
        position: absolute; top: 20px; right: 20px;
        background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 50%;
        font-size: 24px; cursor: pointer; color: #475569; display: flex; align-items: center; justify-content: center;
        transition: background 0.2s, color 0.2s; z-index: 10;
      }
      .content-modal-close:hover { background: #e2e8f0; color: #0f172a; }
      .content-modal-title { font-size: 2rem; font-weight: 800; color: var(--color-navy); margin-bottom: 20px; }
      .content-modal-body { font-size: 1.05rem; color: #475569; line-height: 1.7; }
      .content-modal-body h4 { font-size: 1.2rem; font-weight: 700; color: var(--color-navy); margin-top: 25px; margin-bottom: 15px; }
      .content-modal-body ul { padding-left: 20px; margin-bottom: 20px; }
      .content-modal-body li { margin-bottom: 10px; }
      @media (max-width: 992px) {
        .content-modal-box { flex-direction: column; }
        .content-modal-left { width: 100%; height: 300px; }
        .content-modal-right { width: 100%; padding: 30px; }
      }
    </style>
    <div id="modals-container"></div>
    <script>
      function openContentModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      function closeContentModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
      }
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('content-modal-overlay')) {
          e.target.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    </script>
"@
    
    if ($content -notmatch 'content-modal-overlay') {
        $content = $content -replace '</body>', "$modalStylesAndScripts`n</body>"
    }

    $matches = [regex]::Matches($content, 'onclick="window\.location\.href=''([^'']+)''"')
    $modalsHtml = ""

    foreach ($match in $matches) {
        $innerPage = $match.Groups[1].Value
        $modalId = "modal-" + $innerPage.Replace('.html', '')
        
        $content = $content.Replace($match.Value, "onclick=`"openContentModal('$modalId')`"")
        
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
    
    # Only add "... More" if it doesn't already exist
    if ($content -notmatch '\.\.\.\. More') {
        $content = $content -replace '(?s)(<p class="(?:product-card-desc|solution-card-desc)".*?</p>)', "`$1`n              <span style=`"color: var(--color-blue-cta); font-weight: 600; font-size: 0.95rem; margin-top: 10px; display: inline-block;`">.... More</span>"
    }
    
    Set-Content $file $content
}
