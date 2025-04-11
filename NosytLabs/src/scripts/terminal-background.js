/**
 * TerminalBackground: Animated CRT-style background with scanlines and noise
 * Lightweight, modular, and performant
 */

export class TerminalBackground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.canvas = null;
    this.ctx = null;
    this.animationFrameId = null;
    this.width = 0;
    this.height = 0;
  }

  initialize() {
    if (!this.container) return;

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1'; // behind content
    this.canvas.style.pointerEvents = 'none';

    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));

    this.animate();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  animate() {
    if (!this.ctx) return;

    const draw = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Draw scanlines
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let y = 0; y < this.height; y += 4) {
        this.ctx.fillRect(0, y, this.width, 2);
      }

      // Add subtle noise
      const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 20;
        data[i] = data[i] + noise;     // R
        data[i + 1] = data[i + 1] + noise; // G
        data[i + 2] = data[i + 2] + noise; // B
        // Alpha remains unchanged
      }
      this.ctx.putImageData(imageData, 0, 0);

      this.animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
    if (this.canvas && this.container.contains(this.canvas)) {
      this.container.removeChild(this.canvas);
    }
  }
}