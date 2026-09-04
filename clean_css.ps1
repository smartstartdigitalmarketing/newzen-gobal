$files = @("d:\newgen gobal website starting\products.html", "d:\newgen gobal website starting\solutions.html")
$newCss = Get-Content "d:\newgen gobal website starting\newcss.txt" -Raw

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    $content = [regex]::Replace($content, '(?s)\s*\.content-modal-overlay \{.*?</style>', "`n$newCss`n      </style>")
    Set-Content $file $content
}
