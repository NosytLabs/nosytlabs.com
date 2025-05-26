// MacPaint-like Drawing Application
function initPaint() {
  const paintWindow = document.getElementById('paint-window');
  
  if (paintWindow) {
    // Create paint interface
    createPaintInterface();
    
    // Initialize paint functionality
    initPaintFunctionality();
    
    // Create paint interface
    function createPaintInterface() {
      const paintContent = paintWindow.querySelector('.window-content');
      if (!paintContent) return;
      
      // Clear existing content
      paintContent.innerHTML = '';
      
      // Create paint layout
      paintContent.innerHTML = `
        <div class="paint-container">
          <div class="paint-toolbar">
            <div class="tool-section">
              <div class="tool-group">
                <button class="tool-button active" data-tool="brush" title="Brush">
                  <img src="/images/win95/tools/brush.png" alt="Brush">
                </button>
                <button class="tool-button" data-tool="pencil" title="Pencil">
                  <img src="/images/win95/tools/pencil.png" alt="Pencil">
                </button>
                <button class="tool-button" data-tool="eraser" title="Eraser">
                  <img src="/images/win95/tools/eraser.png" alt="Eraser">
                </button>
                <button class="tool-button" data-tool="line" title="Line">
                  <img src="/images/win95/tools/line.png" alt="Line">
                </button>
                <button class="tool-button" data-tool="rectangle" title="Rectangle">
                  <img src="/images/win95/tools/rectangle.png" alt="Rectangle">
                </button>
                <button class="tool-button" data-tool="circle" title="Circle">
                  <img src="/images/win95/tools/circle.png" alt="Circle">
                </button>
                <button class="tool-button" data-tool="fill" title="Fill">
                  <img src="/images/win95/tools/fill.png" alt="Fill">
                </button>
                <button class="tool-button" data-tool="text" title="Text">
                  <img src="/images/win95/tools/text.png" alt="Text">
                </button>
              </div>
            </div>
            <div class="color-section">
              <div class="color-palette">
                <div class="color-swatch active" data-color="#000000" style="background-color: #000000;"></div>
                <div class="color-swatch" data-color="#FFFFFF" style="background-color: #FFFFFF;"></div>
                <div class="color-swatch" data-color="#FF0000" style="background-color: #FF0000;"></div>
                <div class="color-swatch" data-color="#00FF00" style="background-color: #00FF00;"></div>
                <div class="color-swatch" data-color="#0000FF" style="background-color: #0000FF;"></div>
                <div class="color-swatch" data-color="#FFFF00" style="background-color: #FFFF00;"></div>
                <div class="color-swatch" data-color="#FF00FF" style="background-color: #FF00FF;"></div>
                <div class="color-swatch" data-color="#00FFFF" style="background-color: #00FFFF;"></div>
                <div class="color-swatch" data-color="#808080" style="background-color: #808080;"></div>
                <div class="color-swatch" data-color="#800000" style="background-color: #800000;"></div>
                <div class="color-swatch" data-color="#008000" style="background-color: #008000;"></div>
                <div class="color-swatch" data-color="#000080" style="background-color: #000080;"></div>
                <div class="color-swatch" data-color="#808000" style="background-color: #808000;"></div>
                <div class="color-swatch" data-color="#800080" style="background-color: #800080;"></div>
                <div class="color-swatch" data-color="#008080" style="background-color: #008080;"></div>
                <div class="color-swatch" data-color="#C0C0C0" style="background-color: #C0C0C0;"></div>
              </div>
              <div class="brush-size">
                <label for="brush-size">Size:</label>
                <input type="range" id="brush-size" min="1" max="50" value="5">
                <span class="size-value">5px</span>
              </div>
            </div>
            <div class="action-section">
              <button class="action-button" id="clear-canvas">Clear</button>
              <button class="action-button" id="save-image">Save</button>
              <button class="action-button" id="load-image">Load</button>
              <input type="file" id="file-input" accept="image/*" style="display: none;">
            </div>
          </div>
          <div class="paint-canvas-container">
            <canvas id="paint-canvas" width="800" height="600"></canvas>
            <div class="canvas-overlay" id="text-overlay" style="display: none;">
              <input type="text" id="text-input" placeholder="Enter text...">
            </div>
          </div>
        </div>
      `;
    }
    
    // Initialize paint functionality
    function initPaintFunctionality() {
      const canvas = paintWindow.querySelector('#paint-canvas');
      const ctx = canvas.getContext('2d');
      const toolButtons = paintWindow.querySelectorAll('.tool-button');
      const colorSwatches = paintWindow.querySelectorAll('.color-swatch');
      const brushSizeSlider = paintWindow.querySelector('#brush-size');
      const sizeValue = paintWindow.querySelector('.size-value');
      const clearButton = paintWindow.querySelector('#clear-canvas');
      const saveButton = paintWindow.querySelector('#save-image');
      const loadButton = paintWindow.querySelector('#load-image');
      const fileInput = paintWindow.querySelector('#file-input');
      const textOverlay = paintWindow.querySelector('#text-overlay');
      const textInput = paintWindow.querySelector('#text-input');
      
      // Drawing state
      let isDrawing = false;
      let currentTool = 'brush';
      let currentColor = '#000000';
      let brushSize = 5;
      let startX, startY;
      let imageData;
      
      // Initialize canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Tool selection
      toolButtons.forEach(button => {
        button.addEventListener('click', function() {
          toolButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          currentTool = this.getAttribute('data-tool');
          
          // Hide text overlay when switching tools
          if (currentTool !== 'text') {
            textOverlay.style.display = 'none';
          }
        });
      });
      
      // Color selection
      colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
          colorSwatches.forEach(sw => sw.classList.remove('active'));
          this.classList.add('active');
          currentColor = this.getAttribute('data-color');
        });
      });
      
      // Brush size
      if (brushSizeSlider && sizeValue) {
        brushSizeSlider.addEventListener('input', function() {
          brushSize = parseInt(this.value);
          sizeValue.textContent = brushSize + 'px';
        });
      }
      
      // Canvas events
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
      
      // Start drawing
      function startDrawing(e) {
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        if (currentTool === 'text') {
          showTextInput(startX, startY);
          return;
        }
        
        isDrawing = true;
        
        // Save image data for shape tools
        if (['line', 'rectangle', 'circle'].includes(currentTool)) {
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        
        // Set drawing properties
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
        ctx.lineWidth = brushSize;
        
        if (currentTool === 'brush' || currentTool === 'pencil') {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
        } else if (currentTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
        } else if (currentTool === 'fill') {
          floodFill(startX, startY, currentColor);
        }
      }
      
      // Draw
      function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser') {
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        } else if (currentTool === 'line') {
          ctx.putImageData(imageData, 0, 0);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        } else if (currentTool === 'rectangle') {
          ctx.putImageData(imageData, 0, 0);
          const width = currentX - startX;
          const height = currentY - startY;
          ctx.strokeRect(startX, startY, width, height);
        } else if (currentTool === 'circle') {
          ctx.putImageData(imageData, 0, 0);
          const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
          ctx.beginPath();
          ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
      
      // Stop drawing
      function stopDrawing() {
        if (isDrawing) {
          isDrawing = false;
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      
      // Show text input
      function showTextInput(x, y) {
        textOverlay.style.display = 'block';
        textOverlay.style.left = x + 'px';
        textOverlay.style.top = y + 'px';
        textInput.focus();
        
        textInput.onkeydown = function(e) {
          if (e.key === 'Enter') {
            const text = textInput.value;
            if (text) {
              ctx.fillStyle = currentColor;
              ctx.font = `${brushSize * 3}px Arial`;
              ctx.fillText(text, x, y);
            }
            textInput.value = '';
            textOverlay.style.display = 'none';
          } else if (e.key === 'Escape') {
            textInput.value = '';
            textOverlay.style.display = 'none';
          }
        };
      }
      
      // Flood fill (simple implementation)
      function floodFill(x, y, fillColor) {
        // This is a simplified flood fill - in a real implementation,
        // you'd want a more efficient algorithm
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const targetColor = getPixelColor(data, x, y, canvas.width);
        
        if (colorMatch(targetColor, hexToRgb(fillColor))) return;
        
        const stack = [[x, y]];
        const fillColorRgb = hexToRgb(fillColor);
        
        while (stack.length > 0) {
          const [currentX, currentY] = stack.pop();
          
          if (currentX < 0 || currentX >= canvas.width || currentY < 0 || currentY >= canvas.height) continue;
          
          const currentColor = getPixelColor(data, currentX, currentY, canvas.width);
          
          if (!colorMatch(currentColor, targetColor)) continue;
          
          setPixelColor(data, currentX, currentY, canvas.width, fillColorRgb);
          
          stack.push([currentX + 1, currentY]);
          stack.push([currentX - 1, currentY]);
          stack.push([currentX, currentY + 1]);
          stack.push([currentX, currentY - 1]);
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      // Helper functions for flood fill
      function getPixelColor(data, x, y, width) {
        const index = (y * width + x) * 4;
        return [data[index], data[index + 1], data[index + 2], data[index + 3]];
      }
      
      function setPixelColor(data, x, y, width, color) {
        const index = (y * width + x) * 4;
        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255;
      }
      
      function colorMatch(color1, color2) {
        return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
      }
      
      function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : [0, 0, 0];
      }
      
      // Clear canvas
      if (clearButton) {
        clearButton.addEventListener('click', function() {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
      }
      
      // Save image
      if (saveButton) {
        saveButton.addEventListener('click', function() {
          const link = document.createElement('a');
          link.download = 'nosyt-paint-' + new Date().getTime() + '.png';
          link.href = canvas.toDataURL();
          link.click();
        });
      }
      
      // Load image
      if (loadButton && fileInput) {
        loadButton.addEventListener('click', function() {
          fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
              const img = new Image();
              img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
              };
              img.src = event.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }
  }
}
