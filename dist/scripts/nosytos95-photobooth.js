// Photo Booth Application
function initPhotoBooth() {
  const photoBoothWindow = document.getElementById('photo-booth-window');
  
  if (photoBoothWindow) {
    // Create photo booth interface
    createPhotoBoothInterface();
    
    // Initialize photo booth functionality
    initPhotoBoothFunctionality();
    
    // Create photo booth interface
    function createPhotoBoothInterface() {
      const photoBoothContent = photoBoothWindow.querySelector('.window-content');
      if (!photoBoothContent) return;
      
      // Clear existing content
      photoBoothContent.innerHTML = '';
      
      // Create photo booth layout
      photoBoothContent.innerHTML = `
        <div class="photo-booth-container">
          <div class="camera-container">
            <video id="camera-feed" autoplay playsinline></video>
            <canvas id="photo-canvas" style="display: none;"></canvas>
            <div class="camera-overlay">
              <div class="camera-loading">
                <div class="loading-spinner"></div>
                <div class="loading-text">Initializing camera...</div>
              </div>
              <div class="camera-error" style="display: none;">
                <div class="error-icon">⚠️</div>
                <div class="error-text">Camera access denied or not available.</div>
                <button class="retry-button">Retry</button>
              </div>
              <div class="camera-countdown" style="display: none;">
                <div class="countdown-number">3</div>
              </div>
              <div class="camera-flash" style="display: none;"></div>
            </div>
          </div>
          <div class="photo-controls">
            <div class="filter-controls">
              <label for="filter-select">Filter:</label>
              <select id="filter-select">
                <option value="none">None</option>
                <option value="grayscale">Grayscale</option>
                <option value="sepia">Sepia</option>
                <option value="invert">Invert</option>
                <option value="blur">Blur</option>
                <option value="brightness">Brightness</option>
                <option value="contrast">Contrast</option>
                <option value="hue-rotate">Hue Rotate</option>
                <option value="saturate">Saturate</option>
              </select>
            </div>
            <div class="capture-controls">
              <button class="capture-button">Take Photo</button>
              <button class="timer-button">3s Timer</button>
            </div>
          </div>
          <div class="photo-gallery">
            <h3>Recent Photos</h3>
            <div class="gallery-grid">
              <!-- Photos will be added here -->
              <div class="empty-gallery">No photos yet</div>
            </div>
          </div>
        </div>
      `;
    }
    
    // Initialize photo booth functionality
    function initPhotoBoothFunctionality() {
      const videoElement = photoBoothWindow.querySelector('#camera-feed');
      const canvasElement = photoBoothWindow.querySelector('#photo-canvas');
      const captureButton = photoBoothWindow.querySelector('.capture-button');
      const timerButton = photoBoothWindow.querySelector('.timer-button');
      const filterSelect = photoBoothWindow.querySelector('#filter-select');
      const galleryGrid = photoBoothWindow.querySelector('.gallery-grid');
      const cameraLoading = photoBoothWindow.querySelector('.camera-loading');
      const cameraError = photoBoothWindow.querySelector('.camera-error');
      const retryButton = photoBoothWindow.querySelector('.retry-button');
      const cameraCountdown = photoBoothWindow.querySelector('.camera-countdown');
      const countdownNumber = photoBoothWindow.querySelector('.countdown-number');
      const cameraFlash = photoBoothWindow.querySelector('.camera-flash');
      
      let stream = null;
      let filterValue = 'none';
      
      // Initialize camera
      initCamera();
      
      // Initialize camera
      function initCamera() {
        if (!videoElement || !canvasElement) return;
        
        // Show loading
        if (cameraLoading) cameraLoading.style.display = 'flex';
        if (cameraError) cameraError.style.display = 'none';
        
        // Check if getUserMedia is supported
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
              stream = mediaStream;
              videoElement.srcObject = mediaStream;
              
              // Hide loading when video is ready
              videoElement.onloadedmetadata = function() {
                if (cameraLoading) cameraLoading.style.display = 'none';
                
                // Set canvas size to match video
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
              };
            })
            .catch(function(error) {
              console.error('Error accessing camera:', error);
              if (cameraLoading) cameraLoading.style.display = 'none';
              if (cameraError) cameraError.style.display = 'flex';
            });
        } else {
          console.error('getUserMedia not supported');
          if (cameraLoading) cameraLoading.style.display = 'none';
          if (cameraError) cameraError.style.display = 'flex';
        }
      }
      
      // Retry camera access
      if (retryButton) {
        retryButton.addEventListener('click', function() {
          initCamera();
        });
      }
      
      // Apply filter to video
      if (filterSelect) {
        filterSelect.addEventListener('change', function() {
          filterValue = this.value;
          applyFilter();
        });
      }
      
      // Apply selected filter to video
      function applyFilter() {
        if (!videoElement) return;
        
        // Reset filters
        videoElement.style.filter = '';
        
        // Apply selected filter
        switch (filterValue) {
          case 'grayscale':
            videoElement.style.filter = 'grayscale(100%)';
            break;
          case 'sepia':
            videoElement.style.filter = 'sepia(100%)';
            break;
          case 'invert':
            videoElement.style.filter = 'invert(100%)';
            break;
          case 'blur':
            videoElement.style.filter = 'blur(5px)';
            break;
          case 'brightness':
            videoElement.style.filter = 'brightness(150%)';
            break;
          case 'contrast':
            videoElement.style.filter = 'contrast(200%)';
            break;
          case 'hue-rotate':
            videoElement.style.filter = 'hue-rotate(180deg)';
            break;
          case 'saturate':
            videoElement.style.filter = 'saturate(200%)';
            break;
        }
      }
      
      // Capture photo
      if (captureButton) {
        captureButton.addEventListener('click', function() {
          capturePhoto();
        });
      }
      
      // Capture with timer
      if (timerButton) {
        timerButton.addEventListener('click', function() {
          startCountdown();
        });
      }
      
      // Start countdown
      function startCountdown() {
        if (!cameraCountdown || !countdownNumber) return;
        
        let count = 3;
        countdownNumber.textContent = count;
        cameraCountdown.style.display = 'flex';
        
        const interval = setInterval(function() {
          count--;
          countdownNumber.textContent = count;
          
          if (count <= 0) {
            clearInterval(interval);
            cameraCountdown.style.display = 'none';
            capturePhoto();
          }
        }, 1000);
      }
      
      // Capture photo
      function capturePhoto() {
        if (!videoElement || !canvasElement || !galleryGrid) return;
        
        // Flash effect
        if (cameraFlash) {
          cameraFlash.style.display = 'block';
          setTimeout(function() {
            cameraFlash.style.display = 'none';
          }, 500);
        }
        
        // Draw video frame to canvas
        const context = canvasElement.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // Apply filter to canvas
        if (filterValue !== 'none') {
          context.filter = videoElement.style.filter;
          context.drawImage(canvasElement, 0, 0, canvasElement.width, canvasElement.height);
          context.filter = 'none';
        }
        
        // Get image data
        const imageData = canvasElement.toDataURL('image/png');
        
        // Add to gallery
        addToGallery(imageData);
      }
      
      // Add photo to gallery
      function addToGallery(imageData) {
        if (!galleryGrid) return;
        
        // Remove empty gallery message if present
        const emptyGallery = galleryGrid.querySelector('.empty-gallery');
        if (emptyGallery) {
          emptyGallery.remove();
        }
        
        // Create photo element
        const photoElement = document.createElement('div');
        photoElement.className = 'gallery-item';
        
        photoElement.innerHTML = `
          <img src="${imageData}" alt="Photo">
          <div class="gallery-item-controls">
            <button class="download-button" title="Download">💾</button>
            <button class="delete-button" title="Delete">🗑️</button>
          </div>
        `;
        
        // Add to gallery
        galleryGrid.prepend(photoElement);
        
        // Download button
        const downloadButton = photoElement.querySelector('.download-button');
        if (downloadButton) {
          downloadButton.addEventListener('click', function() {
            const link = document.createElement('a');
            link.href = imageData;
            link.download = 'photo_' + new Date().getTime() + '.png';
            link.click();
          });
        }
        
        // Delete button
        const deleteButton = photoElement.querySelector('.delete-button');
        if (deleteButton) {
          deleteButton.addEventListener('click', function() {
            photoElement.remove();
            
            // Show empty gallery message if no photos
            if (galleryGrid.children.length === 0) {
              const emptyElement = document.createElement('div');
              emptyElement.className = 'empty-gallery';
              emptyElement.textContent = 'No photos yet';
              galleryGrid.appendChild(emptyElement);
            }
          });
        }
      }
      
      // Clean up when window is closed
      const closeButton = photoBoothWindow.querySelector('.window-close');
      if (closeButton) {
        closeButton.addEventListener('click', function() {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        });
      }
    }
  }
}
