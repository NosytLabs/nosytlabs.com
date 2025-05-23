# Script to download sound files for NosytOS95 and Duck Hunt

# Create directories if they don't exist
New-Item -ItemType Directory -Path public\sounds\win95 -Force
New-Item -ItemType Directory -Path public\sounds\duck-hunt -Force
New-Item -ItemType Directory -Path public\sounds\doom -Force

# Windows 95 sounds
$win95Sounds = @(
    @{url = "https://archive.org/download/Win95-audio-media/Windows%2095%20audio%20media/CHORD.WAV"; dest = "public\sounds\win95\chord.wav"},
    @{url = "https://archive.org/download/Win95-audio-media/Windows%2095%20audio%20media/DING.WAV"; dest = "public\sounds\win95\ding.wav"},
    @{url = "https://archive.org/download/Win95-audio-media/Windows%2095%20audio%20media/TADA.WAV"; dest = "public\sounds\win95\tada.wav"},
    @{url = "https://archive.org/download/Win95-audio-media/Windows%2095%20audio%20media/The%20Microsoft%20Sound.wav"; dest = "public\sounds\win95\startup.wav"},
    @{url = "https://archive.org/download/Win95-audio-media/Windows%2095%20audio%20media/CHIMES.WAV"; dest = "public\sounds\win95\chimes.wav"}
)

# Duck Hunt sounds
$duckHuntSounds = @(
    @{url = "https://archive.org/download/DuckHuntSoundEffects/Duck%20Hunt%20-%20Intro.mp3"; dest = "public\sounds\duck-hunt\intro.mp3"},
    @{url = "https://archive.org/download/DuckHuntSoundEffects/Duck%20Hunt%20-%20Duck%20Flying.mp3"; dest = "public\sounds\duck-hunt\quack.mp3"},
    @{url = "https://archive.org/download/DuckHuntSoundEffects/Duck%20Hunt%20-%20Gun%20Shot.mp3"; dest = "public\sounds\duck-hunt\shot.mp3"},
    @{url = "https://archive.org/download/DuckHuntSoundEffects/Duck%20Hunt%20-%20Duck%20Falls.mp3"; dest = "public\sounds\duck-hunt\fall.mp3"},
    @{url = "https://archive.org/download/DuckHuntSoundEffects/Duck%20Hunt%20-%20Level%20Clear.mp3"; dest = "public\sounds\duck-hunt\level-up.mp3"}
)

# Function to download a file
function Download-File {
    param (
        [string]$url,
        [string]$destination
    )
    
    try {
        Write-Host "Downloading $url to $destination..."
        Invoke-WebRequest -Uri $url -OutFile $destination
        Write-Host "Downloaded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download $url. Error: $_" -ForegroundColor Red
    }
}

# Download Windows 95 sounds
Write-Host "Downloading Windows 95 sounds..." -ForegroundColor Cyan
foreach ($sound in $win95Sounds) {
    Download-File -url $sound.url -destination $sound.dest
}

# Download Duck Hunt sounds
Write-Host "Downloading Duck Hunt sounds..." -ForegroundColor Cyan
foreach ($sound in $duckHuntSounds) {
    Download-File -url $sound.url -destination $sound.dest
}

Write-Host "All sound files downloaded!" -ForegroundColor Green
