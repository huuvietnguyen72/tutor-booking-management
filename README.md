# Tutor Booking Management

Monorepo containing a Spring Boot backend and a Next.js frontend.

## Requirements

- Java 17
- Node.js 20.9 or newer
- npm
- MySQL 8 running on port 3306

## Local Configuration

Create the ignored backend configuration file from the tracked example:

```powershell
Copy-Item .\src\main\resources\application-local.example.properties .\src\main\resources\application-local.properties
```

Edit the copied file, or set the environment variables below. The MySQL account must have permission to create `TutorBookingDb` on the first run, or you must create the database first.

Generate a local JWT signing key and replace `replace-with-generated-base64-secret` in the ignored backend local file:

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$jwtSecret = [Convert]::ToBase64String($bytes)
$rng.Dispose()
$jwtSecret
```

| Variables | Purpose | Required |
| --- | --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` | Local MySQL connection | Yes |
| `JWT_SECRET` | Base64 JWT signing key, at least 32 random bytes | Yes |
| `CLIENT_ID`, `SECRET_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google sign-in | Only for Google sign-in |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | Password reset email | Only for email |
| `GEMINI_API_KEY` | AI features | Only for AI |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image upload | Only for image upload |
| `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY` | Payments | Only for payments |

Optional integrations remain unavailable until configured. Store real values only in ignored local files or deployment secret stores.

Frontend configuration is stored in the ignored file:

```text
frontend/.env.local
```

Create the frontend file from `frontend/.env.example`. The local API URL must be:

```properties
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Install

```powershell
npm run setup
```

## Run The Full Application

```powershell
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui/index.html

Press `Ctrl+C` to stop both development servers.

## Build And Test

```powershell
npm run build
npm test
```

## Run Services Separately

Backend:

```powershell
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
npm --prefix frontend run dev
```
