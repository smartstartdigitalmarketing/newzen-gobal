$files = @("d:\newgen gobal website starting\products.html", "d:\newgen gobal website starting\product-electrical-components.html")
$newContent = Get-Content "d:\newgen gobal website starting\newcards.txt" -Raw

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    $pattern = '(?s)<div style="display: grid; grid-template-columns: repeat\(auto-fit, minmax\(220px, 1fr\)\); gap: 20px; margin-bottom: 40px;">.*?</div>\s*</div>'
    $content = [regex]::Replace($content, $pattern, $newContent)
    Set-Content $file $content
}
