# Script to create placeholder sound files for Duck Hunt

# Create directories if they don't exist
New-Item -ItemType Directory -Path public\sounds\duck-hunt -Force

# Copy existing sound files as placeholders
Copy-Item -Path public\sounds\win95\chord.wav -Destination public\sounds\duck-hunt\shot.mp3 -Force
Copy-Item -Path public\sounds\win95\ding.wav -Destination public\sounds\duck-hunt\quack.mp3 -Force
Copy-Item -Path public\sounds\win95\tada.wav -Destination public\sounds\duck-hunt\fall.mp3 -Force
Copy-Item -Path public\sounds\win95\chimes.wav -Destination public\sounds\duck-hunt\level-up.mp3 -Force

Write-Host "Created placeholder sound files for Duck Hunt" -ForegroundColor Green
