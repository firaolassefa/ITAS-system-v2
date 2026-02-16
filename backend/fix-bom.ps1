# Fix BOM in all Java files
Write-Host "Fixing BOM characters in Java files..."

Get-ChildItem -Path . -Filter *.java -Recurse | ForEach-Object {
    $file = $_.FullName
    Write-Host "Processing: $file"
    
    try {
        # Read file as bytes
        $bytes = [System.IO.File]::ReadAllBytes($file)
        
        # Check for UTF-8 BOM (EF BB BF)
        if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
            Write-Host "  Removing BOM from: $file"
            
            # Remove first 3 bytes (BOM)
            $newBytes = New-Object byte[] ($bytes.Length - 3)
            [System.Array]::Copy($bytes, 3, $newBytes, 0, $newBytes.Length)
            
            # Save without BOM
            [System.IO.File]::WriteAllBytes($file, $newBytes)
            Write-Host "  Fixed: $file"
        } else {
            Write-Host "  No BOM found: $file"
        }
    } catch {
        Write-Host "  Error processing $file : $_"
    }
}

Write-Host "Done!"
