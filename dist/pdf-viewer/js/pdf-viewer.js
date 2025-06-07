class PDFViewer {
    constructor() {
        this.pdfDoc = null;
        this.pageNum = 1;
        this.scale = 1;
        this.rotation = 0;
        this.pageRendering = false;
        this.pageNumPending = null;
        this.canvas = document.getElementById('pdf-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pageCache = new Map();
        this.maxCacheSize = 10;
        this.thumbnailCache = new Map();

        this.initializeControls();
        this.initializeEventListeners();
    }

    initializeControls() {
        this.prevButton = document.getElementById('prev-page');
        this.nextButton = document.getElementById('next-page');
        this.pageInput = document.getElementById('current-page');
        this.pageCount = document.getElementById('page-count');
        this.zoomSelect = document.getElementById('zoom-level');
        this.zoomInButton = document.getElementById('zoom-in');
        this.zoomOutButton = document.getElementById('zoom-out');
        this.rotateButton = document.getElementById('rotate');
        this.thumbnailContainer = document.getElementById('thumbnail-container');
    }

    initializeEventListeners() {
        this.prevButton.addEventListener('click', () => this.prevPage());
        this.nextButton.addEventListener('click', () => this.nextPage());
        this.pageInput.addEventListener('change', (e) => this.goToPage(parseInt(e.target.value)));
        this.zoomSelect.addEventListener('change', (e) => this.setZoom(parseFloat(e.target.value)));
        this.zoomInButton.addEventListener('click', () => this.zoomIn());
        this.zoomOutButton.addEventListener('click', () => this.zoomOut());
        this.rotateButton.addEventListener('click', () => this.rotatePages());

        // Handle drag and drop
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type === 'application/pdf') {
                    await this.loadPDF(file);
                }
            }
        });

        // Handle menu actions
        document.addEventListener('menuAction', (e) => this.handleMenuAction(e.detail.action));
    }

    async loadPDF(source) {
        try {
            this.showLoading();
            
            // Clear caches when loading new PDF
            this.pageCache.clear();
            this.thumbnailCache.clear();

            // Load the PDF
            const loadingTask = pdfjsLib.getDocument(source);
            this.pdfDoc = await loadingTask.promise;

            // Update page count and navigation controls
            this.pageCount.textContent = this.pdfDoc.numPages;
            this.pageInput.max = this.pdfDoc.numPages;
            this.updateNavigation();

            // Generate thumbnails
            await this.generateThumbnails();

            // Render first page
            this.renderPage(1);

            this.hideLoading();
        } catch (error) {
            this.handleError('Error loading PDF: ' + error.message);
        }
    }

    async renderPage(num) {
        if (this.pageRendering) {
            this.pageNumPending = num;
            return;
        }

        this.pageRendering = true;
        this.pageNum = num;
        this.pageInput.value = num;

        try {
            // Check cache first
            let page = this.pageCache.get(num);
            if (!page) {
                page = await this.pdfDoc.getPage(num);
                this.cachePageObject(num, page);
            }

            // Calculate viewport
            const viewport = page.getViewport({ scale: this.scale, rotation: this.rotation });

            // Set canvas dimensions
            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;

            // Render PDF page
            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            
            this.pageRendering = false;
            if (this.pageNumPending !== null) {
                this.renderPage(this.pageNumPending);
                this.pageNumPending = null;
            }

            this.updateNavigation();
        } catch (error) {
            this.pageRendering = false;
            this.handleError('Error rendering page: ' + error.message);
        }
    }

    async generateThumbnails() {
        this.thumbnailContainer.innerHTML = '';
        const scale = 0.2;

        for (let i = 1; i <= this.pdfDoc.numPages; i++) {
            const thumbnailCanvas = document.createElement('canvas');
            const div = document.createElement('div');
            div.className = 'thumbnail';
            div.dataset.pageNumber = i;
            div.appendChild(thumbnailCanvas);
            this.thumbnailContainer.appendChild(div);

            try {
                const page = await this.pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale });
                thumbnailCanvas.width = viewport.width;
                thumbnailCanvas.height = viewport.height;

                await page.render({
                    canvasContext: thumbnailCanvas.getContext('2d'),
                    viewport
                }).promise;

                this.thumbnailCache.set(i, thumbnailCanvas);
                
                div.addEventListener('click', () => this.goToPage(i));
            } catch (error) {
                console.error('Error generating thumbnail:', error);
            }
        }

        this.updateThumbnailHighlight();
    }

    cachePageObject(pageNum, pageObj) {
        if (this.pageCache.size >= this.maxCacheSize) {
            // Remove oldest entry
            const firstKey = this.pageCache.keys().next().value;
            this.pageCache.delete(firstKey);
        }
        this.pageCache.set(pageNum, pageObj);
    }

    updateNavigation() {
        this.prevButton.disabled = this.pageNum <= 1;
        this.nextButton.disabled = this.pageNum >= this.pdfDoc.numPages;
        this.updateThumbnailHighlight();
    }

    updateThumbnailHighlight() {
        const thumbnails = this.thumbnailContainer.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.classList.toggle('active', 
                parseInt(thumb.dataset.pageNumber) === this.pageNum);
        });
    }

    prevPage() {
        if (this.pageNum <= 1) return;
        this.renderPage(this.pageNum - 1);
    }

    nextPage() {
        if (this.pageNum >= this.pdfDoc.numPages) return;
        this.renderPage(this.pageNum + 1);
    }

    goToPage(num) {
        if (num < 1 || num > this.pdfDoc.numPages) return;
        this.renderPage(num);
    }

    setZoom(newScale) {
        this.scale = newScale;
        this.renderPage(this.pageNum);
    }

    zoomIn() {
        const newScale = Math.min(this.scale * 1.25, 3.0);
        this.setZoom(newScale);
    }

    zoomOut() {
        const newScale = Math.max(this.scale * 0.8, 0.25);
        this.setZoom(newScale);
    }

    rotatePages() {
        this.rotation = (this.rotation + 90) % 360;
        this.renderPage(this.pageNum);
    }

    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = `
            <div>Loading PDF...</div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) loading.remove();
    }

    handleError(message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = `
            <div>${message}</div>
            <button onclick="this.parentElement.remove()">OK</button>
        `;
        document.body.appendChild(error);
    }

    handleMenuAction(action) {
        switch(action) {
            case 'open':
                this.openFileDialog();
                break;
            case 'print':
                this.printDocument();
                break;
            case 'zoomIn':
                this.zoomIn();
                break;
            case 'zoomOut':
                this.zoomOut();
                break;
            case 'actualSize':
                this.setZoom(1);
                break;
            case 'rotateRight':
                this.rotatePages();
                break;
            case 'rotateLeft':
                this.rotation = (this.rotation + 270) % 360;
                this.renderPage(this.pageNum);
                break;
            case 'find':
                this.showFindDialog();
                break;
            // Add more menu actions as needed
        }
    }

    openFileDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        input.onchange = async (e) => {
            if (e.target.files.length > 0) {
                await this.loadPDF(e.target.files[0]);
            }
        };
        input.click();
    }

    async printDocument() {
        // Simulate print dialog
        const dialog = document.createElement('div');
        dialog.className = 'print-dialog';
        dialog.innerHTML = `
            <div>Print</div>
            <div class="print-options">
                <label>
                    <input type="checkbox" checked> All pages
                </label>
                <label>
                    <input type="checkbox"> Print with annotations
                </label>
            </div>
            <div class="button-row">
                <button onclick="this.parentElement.parentElement.remove()">Cancel</button>
                <button onclick="alert('Printing is simulated in this demo'); this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        document.body.appendChild(dialog);
    }

    showFindDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'search-dialog';
        dialog.innerHTML = `
            <input type="text" class="search-input" placeholder="Find...">
            <button onclick="this.parentElement.remove()">Cancel</button>
        `;
        document.body.appendChild(dialog);
    }
}

// Initialize the viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const viewer = new PDFViewer();

    // Load sample PDF if available
    const samplePDF = 'files/sample-website-audit.pdf';
    fetch(samplePDF)
        .then(response => response.blob())
        .then(blob => viewer.loadPDF(blob))
        .catch(error => console.error('Error loading sample PDF:', error));
});