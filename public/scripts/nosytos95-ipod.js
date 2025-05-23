// iPod/Music Player Application
function initMusicPlayer() {
  const musicPlayerWindow = document.getElementById('music-player-window');
  
  if (musicPlayerWindow) {
    // Create music player interface
    createMusicPlayerInterface();
    
    // Initialize music player functionality
    initMusicPlayerFunctionality();
    
    // Create music player interface
    function createMusicPlayerInterface() {
      const musicPlayerContent = musicPlayerWindow.querySelector('.window-content');
      if (!musicPlayerContent) return;
      
      // Clear existing content
      musicPlayerContent.innerHTML = '';
      
      // Create music player layout
      musicPlayerContent.innerHTML = `
        <div class="music-player-container">
          <div class="music-player-sidebar">
            <div class="sidebar-section">
              <div class="sidebar-header">Library</div>
              <div class="sidebar-items">
                <div class="sidebar-item active" data-view="songs">
                  <img src="/images/win95/music.png" alt="Songs">
                  <span>Songs</span>
                </div>
                <div class="sidebar-item" data-view="albums">
                  <img src="/images/win95/album.png" alt="Albums">
                  <span>Albums</span>
                </div>
                <div class="sidebar-item" data-view="artists">
                  <img src="/images/win95/artist.png" alt="Artists">
                  <span>Artists</span>
                </div>
                <div class="sidebar-item" data-view="playlists">
                  <img src="/images/win95/playlist.png" alt="Playlists">
                  <span>Playlists</span>
                </div>
              </div>
            </div>
            <div class="sidebar-section">
              <div class="sidebar-header">Playlists</div>
              <div class="sidebar-items">
                <div class="sidebar-item" data-playlist="recently-added">
                  <img src="/images/win95/playlist.png" alt="Recently Added">
                  <span>Recently Added</span>
                </div>
                <div class="sidebar-item" data-playlist="top-rated">
                  <img src="/images/win95/playlist.png" alt="Top Rated">
                  <span>Top Rated</span>
                </div>
                <div class="sidebar-item" data-playlist="favorites">
                  <img src="/images/win95/playlist.png" alt="Favorites">
                  <span>Favorites</span>
                </div>
                <div class="sidebar-item" data-playlist="90s-hits">
                  <img src="/images/win95/playlist.png" alt="90s Hits">
                  <span>90s Hits</span>
                </div>
                <div class="sidebar-item" data-playlist="retro-gaming">
                  <img src="/images/win95/playlist.png" alt="Retro Gaming">
                  <span>Retro Gaming</span>
                </div>
              </div>
            </div>
          </div>
          <div class="music-player-main">
            <div class="music-player-header">
              <div class="search-bar">
                <input type="text" placeholder="Search...">
                <button class="search-button">🔍</button>
              </div>
              <div class="view-options">
                <button class="view-button active" data-view="list">List</button>
                <button class="view-button" data-view="grid">Grid</button>
              </div>
            </div>
            <div class="music-player-content">
              <div class="content-view songs-view active">
                <table class="songs-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Album</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Songs will be added here -->
                  </tbody>
                </table>
              </div>
              <div class="content-view albums-view">
                <div class="albums-grid">
                  <!-- Albums will be added here -->
                </div>
              </div>
              <div class="content-view artists-view">
                <div class="artists-grid">
                  <!-- Artists will be added here -->
                </div>
              </div>
              <div class="content-view playlists-view">
                <div class="playlists-grid">
                  <!-- Playlists will be added here -->
                </div>
              </div>
            </div>
          </div>
          <div class="music-player-controls">
            <div class="now-playing">
              <div class="album-art">
                <img src="/images/win95/default-album.png" alt="Album Art">
              </div>
              <div class="track-info">
                <div class="track-title">No Track Playing</div>
                <div class="track-artist">--</div>
              </div>
            </div>
            <div class="playback-controls">
              <button class="control-button previous-button" title="Previous">⏮️</button>
              <button class="control-button play-button" title="Play">▶️</button>
              <button class="control-button next-button" title="Next">⏭️</button>
              <button class="control-button shuffle-button" title="Shuffle">🔀</button>
              <button class="control-button repeat-button" title="Repeat">🔁</button>
            </div>
            <div class="volume-controls">
              <button class="volume-button" title="Mute">🔊</button>
              <input type="range" class="volume-slider" min="0" max="100" value="50">
            </div>
            <div class="progress-controls">
              <div class="time-elapsed">0:00</div>
              <div class="progress-bar-container">
                <div class="progress-bar"></div>
              </div>
              <div class="time-total">0:00</div>
            </div>
          </div>
        </div>
      `;
      
      // Load songs
      loadSongs();
    }
    
    // Initialize music player functionality
    function initMusicPlayerFunctionality() {
      // Sidebar navigation
      const sidebarItems = musicPlayerWindow.querySelectorAll('.sidebar-item');
      const contentViews = musicPlayerWindow.querySelectorAll('.content-view');
      
      sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
          // Update active sidebar item
          sidebarItems.forEach(i => i.classList.remove('active'));
          this.classList.add('active');
          
          // Show corresponding view
          const view = this.getAttribute('data-view');
          const playlist = this.getAttribute('data-playlist');
          
          if (view) {
            contentViews.forEach(v => v.classList.remove('active'));
            musicPlayerWindow.querySelector(`.${view}-view`).classList.add('active');
          } else if (playlist) {
            contentViews.forEach(v => v.classList.remove('active'));
            musicPlayerWindow.querySelector('.songs-view').classList.add('active');
            loadPlaylist(playlist);
          }
        });
      });
      
      // View options
      const viewButtons = musicPlayerWindow.querySelectorAll('.view-button');
      viewButtons.forEach(button => {
        button.addEventListener('click', function() {
          viewButtons.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          
          const view = this.getAttribute('data-view');
          // Implementation for switching between list and grid views
        });
      });
      
      // Playback controls
      const playButton = musicPlayerWindow.querySelector('.play-button');
      const previousButton = musicPlayerWindow.querySelector('.previous-button');
      const nextButton = musicPlayerWindow.querySelector('.next-button');
      const shuffleButton = musicPlayerWindow.querySelector('.shuffle-button');
      const repeatButton = musicPlayerWindow.querySelector('.repeat-button');
      const volumeButton = musicPlayerWindow.querySelector('.volume-button');
      const volumeSlider = musicPlayerWindow.querySelector('.volume-slider');
      const progressBar = musicPlayerWindow.querySelector('.progress-bar');
      
      let currentTrack = null;
      let isPlaying = false;
      let isShuffle = false;
      let isRepeat = false;
      let isMuted = false;
      let audioElement = new Audio();
      
      // Play button
      if (playButton) {
        playButton.addEventListener('click', function() {
          if (!currentTrack) {
            // Play first track if none is selected
            const firstTrack = musicPlayerWindow.querySelector('.song-row');
            if (firstTrack) {
              playSong(firstTrack.getAttribute('data-index'));
            }
          } else if (isPlaying) {
            pauseSong();
          } else {
            resumeSong();
          }
        });
      }
      
      // Previous button
      if (previousButton) {
        previousButton.addEventListener('click', function() {
          playPreviousSong();
        });
      }
      
      // Next button
      if (nextButton) {
        nextButton.addEventListener('click', function() {
          playNextSong();
        });
      }
      
      // Shuffle button
      if (shuffleButton) {
        shuffleButton.addEventListener('click', function() {
          isShuffle = !isShuffle;
          this.classList.toggle('active', isShuffle);
        });
      }
      
      // Repeat button
      if (repeatButton) {
        repeatButton.addEventListener('click', function() {
          isRepeat = !isRepeat;
          this.classList.toggle('active', isRepeat);
        });
      }
      
      // Volume button
      if (volumeButton) {
        volumeButton.addEventListener('click', function() {
          isMuted = !isMuted;
          audioElement.muted = isMuted;
          this.textContent = isMuted ? '🔇' : '🔊';
        });
      }
      
      // Volume slider
      if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
          audioElement.volume = this.value / 100;
          if (this.value === '0') {
            volumeButton.textContent = '🔇';
            isMuted = true;
          } else {
            volumeButton.textContent = '🔊';
            isMuted = false;
          }
        });
      }
      
      // Audio element event listeners
      audioElement.addEventListener('timeupdate', updateProgress);
      audioElement.addEventListener('ended', handleTrackEnd);
      
      // Update progress bar
      function updateProgress() {
        const timeElapsed = musicPlayerWindow.querySelector('.time-elapsed');
        const timeTotal = musicPlayerWindow.querySelector('.time-total');
        
        if (timeElapsed && timeTotal && progressBar) {
          const currentTime = formatTime(audioElement.currentTime);
          const duration = formatTime(audioElement.duration);
          
          timeElapsed.textContent = currentTime;
          timeTotal.textContent = duration;
          
          const percent = (audioElement.currentTime / audioElement.duration) * 100;
          progressBar.style.width = `${percent}%`;
        }
      }
      
      // Handle track end
      function handleTrackEnd() {
        if (isRepeat) {
          audioElement.currentTime = 0;
          audioElement.play();
        } else {
          playNextSong();
        }
      }
      
      // Format time (seconds to MM:SS)
      function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
      }
      
      // Play song
      function playSong(index) {
        const songs = getMusicLibrary();
        if (index >= 0 && index < songs.length) {
          currentTrack = songs[index];
          
          // Update UI
          const trackTitle = musicPlayerWindow.querySelector('.track-title');
          const trackArtist = musicPlayerWindow.querySelector('.track-artist');
          const albumArt = musicPlayerWindow.querySelector('.album-art img');
          
          if (trackTitle) trackTitle.textContent = currentTrack.title;
          if (trackArtist) trackArtist.textContent = currentTrack.artist;
          if (albumArt) albumArt.src = currentTrack.albumArt || '/images/win95/default-album.png';
          
          // Update play button
          if (playButton) playButton.textContent = '⏸️';
          
          // Play audio
          audioElement.src = currentTrack.file;
          audioElement.volume = volumeSlider ? volumeSlider.value / 100 : 0.5;
          audioElement.play();
          isPlaying = true;
          
          // Highlight current song in list
          const songRows = musicPlayerWindow.querySelectorAll('.song-row');
          songRows.forEach(row => {
            row.classList.toggle('active', row.getAttribute('data-index') === index.toString());
          });
        }
      }
      
      // Pause song
      function pauseSong() {
        audioElement.pause();
        isPlaying = false;
        if (playButton) playButton.textContent = '▶️';
      }
      
      // Resume song
      function resumeSong() {
        audioElement.play();
        isPlaying = true;
        if (playButton) playButton.textContent = '⏸️';
      }
      
      // Play previous song
      function playPreviousSong() {
        if (!currentTrack) return;
        
        const songs = getMusicLibrary();
        let index = songs.findIndex(song => song.id === currentTrack.id);
        
        if (index > 0) {
          playSong(index - 1);
        } else {
          // Wrap around to the last song
          playSong(songs.length - 1);
        }
      }
      
      // Play next song
      function playNextSong() {
        if (!currentTrack) return;
        
        const songs = getMusicLibrary();
        let index = songs.findIndex(song => song.id === currentTrack.id);
        
        if (isShuffle) {
          // Play random song
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * songs.length);
          } while (randomIndex === index && songs.length > 1);
          
          playSong(randomIndex);
        } else if (index < songs.length - 1) {
          playSong(index + 1);
        } else {
          // Wrap around to the first song
          playSong(0);
        }
      }
    }
    
    // Load songs
    function loadSongs() {
      const songsTable = musicPlayerWindow.querySelector('.songs-table tbody');
      if (!songsTable) return;
      
      // Clear existing songs
      songsTable.innerHTML = '';
      
      // Get music library
      const songs = getMusicLibrary();
      
      // Add songs to table
      songs.forEach((song, index) => {
        const row = document.createElement('tr');
        row.className = 'song-row';
        row.setAttribute('data-index', index);
        
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${song.title}</td>
          <td>${song.artist}</td>
          <td>${song.album}</td>
          <td>${song.duration}</td>
        `;
        
        row.addEventListener('dblclick', function() {
          playSong(index);
        });
        
        songsTable.appendChild(row);
      });
      
      // Load albums
      loadAlbums();
      
      // Load artists
      loadArtists();
      
      // Load playlists
      loadAllPlaylists();
    }
    
    // Load albums
    function loadAlbums() {
      const albumsGrid = musicPlayerWindow.querySelector('.albums-grid');
      if (!albumsGrid) return;
      
      // Clear existing albums
      albumsGrid.innerHTML = '';
      
      // Get unique albums
      const songs = getMusicLibrary();
      const albums = [];
      const albumMap = {};
      
      songs.forEach(song => {
        if (!albumMap[song.album]) {
          albumMap[song.album] = true;
          albums.push({
            title: song.album,
            artist: song.artist,
            albumArt: song.albumArt || '/images/win95/default-album.png'
          });
        }
      });
      
      // Add albums to grid
      albums.forEach(album => {
        const albumElement = document.createElement('div');
        albumElement.className = 'album-item';
        
        albumElement.innerHTML = `
          <div class="album-art">
            <img src="${album.albumArt}" alt="${album.title}">
          </div>
          <div class="album-info">
            <div class="album-title">${album.title}</div>
            <div class="album-artist">${album.artist}</div>
          </div>
        `;
        
        albumsGrid.appendChild(albumElement);
      });
    }
    
    // Load artists
    function loadArtists() {
      const artistsGrid = musicPlayerWindow.querySelector('.artists-grid');
      if (!artistsGrid) return;
      
      // Clear existing artists
      artistsGrid.innerHTML = '';
      
      // Get unique artists
      const songs = getMusicLibrary();
      const artists = [];
      const artistMap = {};
      
      songs.forEach(song => {
        if (!artistMap[song.artist]) {
          artistMap[song.artist] = true;
          artists.push({
            name: song.artist,
            image: '/images/win95/artist.png'
          });
        }
      });
      
      // Add artists to grid
      artists.forEach(artist => {
        const artistElement = document.createElement('div');
        artistElement.className = 'artist-item';
        
        artistElement.innerHTML = `
          <div class="artist-image">
            <img src="${artist.image}" alt="${artist.name}">
          </div>
          <div class="artist-info">
            <div class="artist-name">${artist.name}</div>
          </div>
        `;
        
        artistsGrid.appendChild(artistElement);
      });
    }
    
    // Load all playlists
    function loadAllPlaylists() {
      const playlistsGrid = musicPlayerWindow.querySelector('.playlists-grid');
      if (!playlistsGrid) return;
      
      // Clear existing playlists
      playlistsGrid.innerHTML = '';
      
      // Get playlists
      const playlists = [
        { id: 'recently-added', name: 'Recently Added', image: '/images/win95/playlist.png' },
        { id: 'top-rated', name: 'Top Rated', image: '/images/win95/playlist.png' },
        { id: 'favorites', name: 'Favorites', image: '/images/win95/playlist.png' },
        { id: '90s-hits', name: '90s Hits', image: '/images/win95/playlist.png' },
        { id: 'retro-gaming', name: 'Retro Gaming', image: '/images/win95/playlist.png' }
      ];
      
      // Add playlists to grid
      playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist-item';
        playlistElement.setAttribute('data-playlist', playlist.id);
        
        playlistElement.innerHTML = `
          <div class="playlist-image">
            <img src="${playlist.image}" alt="${playlist.name}">
          </div>
          <div class="playlist-info">
            <div class="playlist-name">${playlist.name}</div>
          </div>
        `;
        
        playlistElement.addEventListener('click', function() {
          loadPlaylist(playlist.id);
        });
        
        playlistsGrid.appendChild(playlistElement);
      });
    }
    
    // Load specific playlist
    function loadPlaylist(playlistId) {
      const songsTable = musicPlayerWindow.querySelector('.songs-table tbody');
      if (!songsTable) return;
      
      // Clear existing songs
      songsTable.innerHTML = '';
      
      // Get playlist songs
      const songs = getPlaylistSongs(playlistId);
      
      // Add songs to table
      songs.forEach((song, index) => {
        const row = document.createElement('tr');
        row.className = 'song-row';
        row.setAttribute('data-index', index);
        
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${song.title}</td>
          <td>${song.artist}</td>
          <td>${song.album}</td>
          <td>${song.duration}</td>
        `;
        
        row.addEventListener('dblclick', function() {
          playSong(index);
        });
        
        songsTable.appendChild(row);
      });
    }
    
    // Get music library
    function getMusicLibrary() {
      return [
        { id: 1, title: 'Windows 95 Startup', artist: 'Microsoft', album: 'Windows Sounds', duration: '0:06', file: '/sounds/win95-startup.mp3', albumArt: '/images/win95/windows-album.png' },
        { id: 2, title: 'Vaporwave Aesthetic', artist: 'Retro Vibes', album: '90s Nostalgia', duration: '3:45', file: '/music/vaporwave.mp3', albumArt: '/images/win95/vaporwave-album.png' },
        { id: 3, title: '8-Bit Adventure', artist: 'Pixel Heroes', album: 'Game Soundtrack', duration: '2:30', file: '/music/8bit.mp3', albumArt: '/images/win95/8bit-album.png' },
        { id: 4, title: 'Dial-Up Connection', artist: 'Internet Sounds', album: 'Tech Memories', duration: '0:15', file: '/sounds/dialup.mp3', albumArt: '/images/win95/internet-album.png' },
        { id: 5, title: 'Office Ambience', artist: 'Work Vibes', album: 'Productivity', duration: '5:20', file: '/music/office.mp3', albumArt: '/images/win95/office-album.png' },
        { id: 6, title: 'Floppy Disk Insert', artist: 'Computer Sounds', album: 'Tech Memories', duration: '0:02', file: '/sounds/floppy.mp3', albumArt: '/images/win95/computer-album.png' },
        { id: 7, title: 'Retro Synth Wave', artist: 'Digital Dreams', album: 'Synthwave', duration: '4:15', file: '/music/synthwave.mp3', albumArt: '/images/win95/synth-album.png' },
        { id: 8, title: 'Windows 95 Error', artist: 'Microsoft', album: 'Windows Sounds', duration: '0:01', file: '/sounds/win95-error.mp3', albumArt: '/images/win95/windows-album.png' },
        { id: 9, title: 'Elevator Music', artist: 'Waiting Room', album: 'Background Sounds', duration: '3:30', file: '/music/elevator.mp3', albumArt: '/images/win95/elevator-album.png' },
        { id: 10, title: 'Keyboard Typing', artist: 'Office Sounds', album: 'Work Ambience', duration: '0:10', file: '/sounds/keyboard.mp3', albumArt: '/images/win95/keyboard-album.png' }
      ];
    }
    
    // Get playlist songs
    function getPlaylistSongs(playlistId) {
      const allSongs = getMusicLibrary();
      
      switch (playlistId) {
        case 'recently-added':
          return allSongs.slice(0, 5);
        case 'top-rated':
          return [allSongs[1], allSongs[2], allSongs[6], allSongs[8]];
        case 'favorites':
          return [allSongs[0], allSongs[2], allSongs[6], allSongs[9]];
        case '90s-hits':
          return [allSongs[0], allSongs[3], allSongs[5], allSongs[7]];
        case 'retro-gaming':
          return [allSongs[2], allSongs[6]];
        default:
          return allSongs;
      }
    }
  }
}
