$token = $env:SUPABASE_ACCESS_TOKEN
if ([string]::IsNullOrWhiteSpace($token)) { throw "Set SUPABASE_ACCESS_TOKEN in the process environment before running this script." }
$base = 'https://api.supabase.com/v1/projects/elfosfndhdlmczmzxeqa/functions'
$headers = @{
    Authorization = "Bearer $token"
    'Content-Type' = 'application/json'
}
$fnsDir = Join-Path $PSScriptRoot 'supabase/functions'
$functions = @('bookings_create','booking_availability','bookings_cancel','payments_upload','payments_verify','notifications_send','audit_log','game_download_request')

foreach ($fn in $functions) {
    $src = Get-Content "$fnsDir/$fn/index.ts" -Raw -Encoding UTF8
    # Build JSON safely using ConvertTo-Json on a hashtable
    $payload = [ordered]@{
        slug       = $fn
        name       = $fn
        body       = $src
        verify_jwt = $fn -notin @('bookings_create', 'booking_availability', 'payments_upload', 'game_download_request')
    }
    $json = $payload | ConvertTo-Json -Depth 10 -Compress
    
    # Try POST (create new)
    $response = Invoke-WebRequest -Uri $base -Method POST -Headers $headers -Body $json -ErrorAction SilentlyContinue
    $status = $response.StatusCode
    
    if ($status -eq 200 -or $status -eq 201) {
        Write-Host "CREATED: $fn (HTTP $status)"
    } else {
        # Try PATCH (update existing)
        $response2 = Invoke-WebRequest -Uri "$base/$fn" -Method PATCH -Headers $headers -Body $json -ErrorAction SilentlyContinue
        $status2 = $response2.StatusCode
        if ($status2 -eq 200 -or $status2 -eq 201) {
            Write-Host "UPDATED: $fn (HTTP $status2)"
        } else {
            Write-Host "RESULT: $fn POST=$status PATCH=$status2 | $($response2.Content.Substring(0, [Math]::Min(200, $response2.Content.Length)))"
        }
    }
}
Write-Host "=== DONE ==="
