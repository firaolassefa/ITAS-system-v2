# Fix imports in Java files
$javaFiles = Get-ChildItem -Recurse -Filter "*.java" | Where-Object { $_.FullName -match "src\\main\\java" }

foreach ($file in $javaFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace javax.persistence with jakarta.persistence
    $content = $content -replace 'import javax\.persistence\.', 'import jakarta.persistence.'
    
    # Replace javax.servlet with jakarta.servlet
    $content = $content -replace 'import javax\.servlet\.', 'import jakarta.servlet.'
    
    # Save if changes were made
    if ($content -ne (Get-Content $file.FullName -Raw)) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Fixed imports in: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Import fixes completed!" -ForegroundColor Cyan
