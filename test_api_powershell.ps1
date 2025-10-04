# Script de prueba para el backend de recompensas
# Ejecutar con: powershell -ExecutionPolicy Bypass -File test_api_powershell.ps1

Write-Host "🚀 Iniciando pruebas del backend de recompensas..." -ForegroundColor Magenta

$apiBase = "http://localhost:3001/api/recompensas"
$errorCount = 0

function Test-Endpoint {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "`n🔍 Probando: $Method $Endpoint" -ForegroundColor Cyan
    
    try {
        $headers = @{ "Content-Type" = "application/json" }
        $uri = "$apiBase$Endpoint"
        
        $bodyJson = $null
        if ($Body) {
            $bodyJson = $Body | ConvertTo-Json
        }
        
        $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -Body $bodyJson -ErrorAction Stop
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✅ Éxito ($($response.StatusCode))" -ForegroundColor Green
            
            try {
                $data = $response.Content | ConvertFrom-Json
                if ($data.success -ne $null) {
                    Write-Host "📋 Respuesta: $($data.success)" -ForegroundColor White
                }
                if ($data.recompensas) {
                    Write-Host "📋 Recompensas encontradas: $($data.recompensas.Count)" -ForegroundColor White
                }
                if ($data.recompensa) {
                    Write-Host "📋 Recompensa: $($data.recompensa.nombre)" -ForegroundColor White
                }
                return $data
            }
            catch {
                Write-Host "📋 Contenido: $($response.Content)" -ForegroundColor White
                return $response.Content
            }
        }
        else {
            Write-Host "❌ Error ($($response.StatusCode))" -ForegroundColor Red
            Write-Host "❌ Contenido: $($response.Content)" -ForegroundColor Red
            $script:errorCount++
            return $null
        }
    }
    catch {
        Write-Host "❌ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
        $script:errorCount++
        return $null
    }
}

# Esperar a que el servidor inicie
Write-Host "⏳ Esperando que el servidor inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test 1: Obtener catálogo completo
Test-Endpoint "/catalogo"

# Test 2: Obtener catálogo por categoría
Test-Endpoint "/catalogo?categoria=insignias"

# Test 3: Obtener recompensa específica
Test-Endpoint "/catalogo/badge_bronce"

# Test 4: Recompensa inexistente
Test-Endpoint "/catalogo/badge_inexistente" -ExpectedStatus 404

Write-Host "`n⚠️ Probando endpoints que requieren autenticación..." -ForegroundColor Yellow

# Test 5: Sin autenticación (debería fallar)
Test-Endpoint "/usuario" -ExpectedStatus 401
Test-Endpoint "/estadisticas" -ExpectedStatus 401

$redeemBody = @{ recompensaId = "badge_bronce" }
Test-Endpoint "/canjear" -Method "POST" -Body $redeemBody -ExpectedStatus 401

Write-Host "`n🎉 Pruebas completadas!" -ForegroundColor Green
Write-Host "📊 Errores encontrados: $errorCount" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Yellow" })

Write-Host "`n📝 Nota: Para probar endpoints autenticados, necesitas:" -ForegroundColor Yellow
Write-Host "   1. Servidor corriendo en puerto 3001" -ForegroundColor Yellow
Write-Host "   2. Token de JWT válido" -ForegroundColor Yellow
Write-Host "   3. Base de datos configurada" -ForegroundColor Yellow
