$ErrorActionPreference = 'Stop'

$runner = Join-Path $PSScriptRoot 'seed-test-data.ps1'

if (-not (Test-Path -LiteralPath $runner -PathType Leaf)) {
    throw "Expected local seed runner at $runner."
}

function Assert-SeedRefusesNonLocalTarget {
    param(
        [string]$Profile,
        [string]$DatabaseHost
    )

    $previousProfile = $env:SPRING_PROFILES_ACTIVE
    $previousHost = $env:DB_HOST

    try {
        $env:SPRING_PROFILES_ACTIVE = $Profile
        $env:DB_HOST = $DatabaseHost
        $previousErrorActionPreference = $ErrorActionPreference
        try {
            $ErrorActionPreference = 'Continue'
            $output = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $runner 2>&1
            $exitCode = $LASTEXITCODE
        }
        finally {
            $ErrorActionPreference = $previousErrorActionPreference
        }

        if ($exitCode -eq 0) {
            throw "Seed runner accepted profile '$Profile' and host '$DatabaseHost'."
        }

        if ("$output" -notmatch 'local') {
            throw "Seed runner did not report its local-only guard for profile '$Profile' and host '$DatabaseHost'."
        }
    }
    finally {
        $env:SPRING_PROFILES_ACTIVE = $previousProfile
        $env:DB_HOST = $previousHost
    }
}

Assert-SeedRefusesNonLocalTarget -Profile 'production' -DatabaseHost 'localhost'
Assert-SeedRefusesNonLocalTarget -Profile 'local' -DatabaseHost 'database.example.test'

Write-Host 'Seed runner refuses non-local profile and database host.'
