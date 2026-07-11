$ErrorActionPreference = "Stop"

$projectRoot = Split-Path $PSScriptRoot -Parent
$sdkPath = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA "Android\Sdk" }
$gradlePath = Join-Path $projectRoot "android\gradlew.bat"
$apkPath = Join-Path $projectRoot "android\app\build\outputs\apk\debug\app-debug.apk"
$releasePath = Join-Path $projectRoot "发布版\词尾接接乐-1.0.0-Android.apk"

if (-not (Test-Path (Join-Path $sdkPath "platform-tools"))) {
  throw "Android SDK not found at $sdkPath"
}

$env:ANDROID_HOME = $sdkPath
$env:ANDROID_SDK_ROOT = $sdkPath

Push-Location $projectRoot
try {
  npm test
  if ($LASTEXITCODE -ne 0) { throw "Game tests failed" }

  npm run build:mobile:web
  if ($LASTEXITCODE -ne 0) { throw "Mobile web build failed" }

  if (-not (Test-Path $gradlePath)) {
    npx cap add android
  } else {
    npx cap sync android
  }
  if ($LASTEXITCODE -ne 0) { throw "Capacitor Android sync failed" }

  Push-Location (Join-Path $projectRoot "android")
  try {
    .\gradlew.bat assembleDebug
    if ($LASTEXITCODE -ne 0) { throw "Android APK build failed" }
  } finally {
    Pop-Location
  }

  if (-not (Test-Path $apkPath)) { throw "APK was not created at $apkPath" }
  New-Item -ItemType Directory -Force (Split-Path $releasePath -Parent) | Out-Null
  Copy-Item -LiteralPath $apkPath -Destination $releasePath -Force
  Write-Output "Android APK ready: $releasePath"
} finally {
  Pop-Location
}
