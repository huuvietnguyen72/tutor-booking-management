$ErrorActionPreference = 'Stop'

function Exit-SeedError {
    param([string]$Message)

    [Console]::Error.WriteLine($Message)
    exit 1
}

$activeProfile = if ([string]::IsNullOrWhiteSpace($env:SPRING_PROFILES_ACTIVE)) {
    'local'
}
else {
    $env:SPRING_PROFILES_ACTIVE
}

if ($activeProfile -ne 'local') {
    Exit-SeedError 'db:seed:test only supports the local Spring profile.'
}

$databaseHost = if ([string]::IsNullOrWhiteSpace($env:DB_HOST)) { 'localhost' } else { $env:DB_HOST }
if ($databaseHost -notin @('localhost', '127.0.0.1', '::1')) {
    Exit-SeedError 'db:seed:test only supports a local MySQL host.'
}

$databasePort = if ([string]::IsNullOrWhiteSpace($env:DB_PORT)) { '3306' } else { $env:DB_PORT }
if ($databasePort -notmatch '^\d+$' -or [int]$databasePort -lt 1 -or [int]$databasePort -gt 65535) {
    Exit-SeedError 'DB_PORT must be a valid local MySQL port.'
}

$databaseName = if ([string]::IsNullOrWhiteSpace($env:DB_NAME)) { 'TutorBookingDb' } else { $env:DB_NAME }
if ($databaseName -notmatch '^[A-Za-z0-9_]+$') {
    Exit-SeedError 'DB_NAME must contain only letters, numbers, and underscores.'
}

$databaseUser = if ([string]::IsNullOrWhiteSpace($env:DB_USERNAME)) { 'root' } else { $env:DB_USERNAME }
$fixturePath = Join-Path $PSScriptRoot '..\src\test\resources\test-data\reset-and-seed.sql'
$fixturePath = [System.IO.Path]::GetFullPath($fixturePath)
if (-not (Test-Path -LiteralPath $fixturePath -PathType Leaf)) {
    Exit-SeedError 'Local test seed fixture is missing.'
}

$mysqlCommand = Get-Command mysql.exe -CommandType Application -ErrorAction SilentlyContinue
if ($null -ne $mysqlCommand) {
    $mysqlClient = $mysqlCommand.Source
}
else {
    $mysqlClient = $null
    foreach ($candidate in @(
            (Join-Path $env:ProgramFiles 'MySQL\MySQL Server 8.0\bin\mysql.exe'),
            (Join-Path $env:ProgramFiles 'MySQL\MySQL Workbench 8.0 CE\mysql.exe')
        )) {
        if (Test-Path -LiteralPath $candidate -PathType Leaf) {
            $mysqlClient = $candidate
            break
        }
    }

    if ($null -eq $mysqlClient) {
        Exit-SeedError 'MySQL client was not found. Install MySQL 8 locally or add mysql.exe to PATH.'
    }
}

$fixtureForMysql = $fixturePath.Replace('\', '/')
$seedCommands = @"
SET @test_password_hash = '`$2a`$10`$J51DVmNx2w60STBt8fqVtucQFmQm0mvGWXiiSgcYLkw029ueDxt9K';
ALTER TABLE bookings MODIFY COLUMN teaching_mode ENUM('ONLINE', 'OFFLINE') NOT NULL;
ALTER TABLE tutor_requests MODIFY COLUMN teaching_mode ENUM('ONLINE', 'OFFLINE', 'BOTH') DEFAULT 'BOTH';
ALTER TABLE tutor_requests MODIFY COLUMN status ENUM('PENDING', 'SEARCHING', 'HAS_APPLICANTS', 'MATCHED', 'CANCELLED') DEFAULT 'PENDING';
ALTER TABLE tutor_applications MODIFY COLUMN status ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
ALTER TABLE sessions MODIFY COLUMN status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING';
SOURCE $fixtureForMysql;
SELECT id FROM bookings WHERE id IN (2, 4) ORDER BY id;
"@

$hadDbPassword = Test-Path Env:DB_PASSWORD
$hadMysqlPassword = Test-Path Env:MYSQL_PWD
$previousMysqlPassword = $env:MYSQL_PWD

try {
    if ($hadDbPassword) {
        $env:MYSQL_PWD = $env:DB_PASSWORD
    }

    $mysqlOutput = @($seedCommands | & $mysqlClient --protocol=TCP "--host=$databaseHost" "--port=$databasePort" "--user=$databaseUser" "--database=$databaseName" --default-character-set=utf8mb4 --batch --skip-column-names 2>&1)
    if ($LASTEXITCODE -ne 0) {
        $mysqlOutput | ForEach-Object { [Console]::Error.WriteLine($_) }
        exit $LASTEXITCODE
    }
}
finally {
    if ($hadMysqlPassword) {
        $env:MYSQL_PWD = $previousMysqlPassword
    }
    else {
        Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue
    }
}

$seededBookingIds = @($mysqlOutput | ForEach-Object { $_.ToString().Trim() } | Where-Object { $_ -match '^\d+$' })
if (($seededBookingIds -join ',') -ne '2,4') {
    Exit-SeedError 'Seed verification failed: bookings 2 and 4 were not both present.'
}

Write-Host 'Local test database seeded and verified bookings 2 and 4.'
