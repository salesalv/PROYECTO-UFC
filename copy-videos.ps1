# Script para copiar archivos de video después del build
Write-Host "Copiando archivos de video a dist..." -ForegroundColor Green

# Copiar pelea.mp4 si existe
if (Test-Path "public\pelea.mp4") {
    Copy-Item "public\pelea.mp4" "dist\pelea.mp4" -Force
    Write-Host "✓ pelea.mp4 copiado a dist/" -ForegroundColor Green
} else {
    Write-Host "⚠ pelea.mp4 no encontrado en public/" -ForegroundColor Yellow
}

# Copiar otros archivos de video si existen
$videoExtensions = @("mp4", "webm", "ogg", "avi", "mov")
foreach ($ext in $videoExtensions) {
    $videos = Get-ChildItem "public\*.$ext" -ErrorAction SilentlyContinue
    foreach ($video in $videos) {
        Copy-Item $video.FullName "dist\$($video.Name)" -Force
        Write-Host "✓ $($video.Name) copiado a dist/" -ForegroundColor Green
    }
}

Write-Host "Proceso completado." -ForegroundColor Green
