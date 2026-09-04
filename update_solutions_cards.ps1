$files = @("d:\newgen gobal website starting\solutions.html", "d:\newgen gobal website starting\solution-integrated-electric-systems.html")
$newContent = Get-Content "d:\newgen gobal website starting\newcards.txt" -Raw

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $pattern = '(?s)<div style="display: grid; grid-template-columns: repeat\(auto-fit, minmax\(220px, 1fr\)\); gap: 20px; margin-bottom: 40px;">.*?</div>\s*</div>'
        $content = [regex]::Replace($content, $pattern, $newContent)
        Set-Content $file $content
        Write-Host "Updated $file"
    }
}
