# Compress img2 videos for web (720p max, 30fps, CRF 23, no audio)
$ffmpeg = (Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter ffmpeg.exe -ErrorAction SilentlyContinue | Select-Object -First 1).FullName
if (-not $ffmpeg) { throw 'ffmpeg not found' }

$img2 = Join-Path $PSScriptRoot 'img2'
$backup = Join-Path $img2 'video-originals'
New-Item -ItemType Directory -Force -Path $backup | Out-Null

$videos = Get-ChildItem $img2 -File | Where-Object { $_.Extension -match '^\.(mp4|mov|MP4|MOV)$' -and $_.Length -gt 3MB }
$results = @()

foreach ($file in $videos) {
  $in = $file.FullName
  $isMov = $file.Extension -match '^\.MOV?$'
  $outName = if ($file.Extension -eq '.MOV') { $file.BaseName + '.mp4' } else { $file.Name }
  $out = Join-Path $img2 $outName
  $tmp = Join-Path $img2 ('.' + $file.BaseName + '.compressing.mp4')

  if (Test-Path $tmp) { Remove-Item $tmp -Force }

  $before = [math]::Round($file.Length / 1MB, 2)
  Copy-Item $in (Join-Path $backup $file.Name) -Force

  & $ffmpeg -hide_banner -loglevel error -y -i $in `
    -an -vf "scale='min(720,iw)':-2,fps=30" `
    -c:v libx264 -crf 23 -preset medium -movflags +faststart `
    $tmp

  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmp)) {
    $results += [pscustomobject]@{ File = $file.Name; Status = 'FAILED'; BeforeMB = $before }
    if (Test-Path $tmp) { Remove-Item $tmp -Force }
    continue
  }

  $after = [math]::Round((Get-Item $tmp).Length / 1MB, 2)
  Remove-Item $in -Force
  Move-Item $tmp $out -Force
  $results += [pscustomobject]@{ File = $outName; Status = 'OK'; BeforeMB = $before; AfterMB = $after }
}

$results | Format-Table -AutoSize
Write-Host "Backups saved to $backup"
