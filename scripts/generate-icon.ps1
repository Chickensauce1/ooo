Add-Type -AssemblyName System.Drawing

$outputPath = Join-Path (Split-Path $PSScriptRoot -Parent) "assets\icon.png"
$bitmap = New-Object System.Drawing.Bitmap 1024, 1024, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.Color]::Transparent)
$graphics.ScaleTransform(2, 2)

function New-RoundedRectanglePath {
  param(
    [System.Drawing.RectangleF]$Rectangle,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $arc = New-Object System.Drawing.RectangleF $Rectangle.X, $Rectangle.Y, $diameter, $diameter
  $path.AddArc($arc, 180, 90)
  $arc.X = $Rectangle.Right - $diameter
  $path.AddArc($arc, 270, 90)
  $arc.Y = $Rectangle.Bottom - $diameter
  $path.AddArc($arc, 0, 90)
  $arc.X = $Rectangle.Left
  $path.AddArc($arc, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundedRectangle {
  param(
    [System.Drawing.RectangleF]$Rectangle,
    [float]$Radius,
    [System.Drawing.Color]$Color
  )

  $path = New-RoundedRectanglePath -Rectangle $Rectangle -Radius $Radius
  $brush = New-Object System.Drawing.SolidBrush $Color
  $graphics.FillPath($brush, $path)
  $brush.Dispose()
  $path.Dispose()
}

$background = New-Object System.Drawing.RectangleF 16, 16, 480, 480
Fill-RoundedRectangle -Rectangle $background -Radius 84 -Color ([System.Drawing.ColorTranslator]::FromHtml("#fffdf8"))

$font = New-Object System.Drawing.Font "Arial", 104, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center

$tiles = @(
  @{ Letter = "A"; X = 161; Y = 42; Color = "#ff7b72" },
  @{ Letter = "B"; X = 48; Y = 274; Color = "#f7c94b" },
  @{ Letter = "C"; X = 274; Y = 274; Color = "#37b6a3" }
)

foreach ($tile in $tiles) {
  $shadow = New-Object System.Drawing.RectangleF ($tile.X + 9), ($tile.Y + 11), 190, 190
  Fill-RoundedRectangle -Rectangle $shadow -Radius 30 -Color ([System.Drawing.ColorTranslator]::FromHtml("#202923"))

  $rectangle = New-Object System.Drawing.RectangleF $tile.X, $tile.Y, 190, 190
  Fill-RoundedRectangle -Rectangle $rectangle -Radius 30 -Color ([System.Drawing.ColorTranslator]::FromHtml($tile.Color))
  $graphics.DrawString($tile.Letter, $font, $textBrush, $rectangle, $format)
}

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$format.Dispose()
$textBrush.Dispose()
$font.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Output "Generated $outputPath"
