if ([string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) { throw "Set SUPABASE_ACCESS_TOKEN in the process environment before running this script." }
Set-Location $PSScriptRoot
supabase link --project-ref elfosfndhdlmczmzxeqa

Write-Host "--- Deploying audit_log (was missing) ---"
supabase functions deploy audit_log --yes

Write-Host "--- Re-deploying notifications_send (syntax fixed) ---"
supabase functions deploy notifications_send --yes

Write-Host "--- Re-deploying all others to confirm ---"
supabase functions deploy equipment_crud --yes
supabase functions deploy bookings_create --yes --no-verify-jwt
supabase functions deploy booking_availability --yes --no-verify-jwt
supabase functions deploy bookings_cancel --yes
supabase functions deploy payments_upload --yes --no-verify-jwt
supabase functions deploy payments_verify --yes
supabase functions deploy game_download_request --yes --no-verify-jwt

Write-Host "=== ALL FUNCTIONS DEPLOYED SUCCESSFULLY ==="
