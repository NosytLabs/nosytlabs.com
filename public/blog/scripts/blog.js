class BlogSystem {
    constructor() {
        this.currentPost = null;
        this.fileSystem = new FileSystem();
        this.postManager = new PostManager(this.fileSystem);
        this.initializeUI();
        this.initializeSystem();
    }

    async initializeSystem() {
        try {
            await this.postManager.initialize();
            this.updatePostList();
            this.setupSearchFunctionality();
        } catch (error) {
            console.error('Error initializing blog system:', error);
            this.showError('Failed to initialize blog system');
        }
    }

    initializeUI() {
        // Menu handlers
        document.querySelector('a[href="#new"]').addEventListener('click', () => this.newPost());
        document.querySelector('a[href="#save"]').addEventListener('click', () => this.savePost());
        document.querySelector('a[href="#preview"]').addEventListener('click', () => this.showPreview());
        document.querySelector('a[href="#publish"]').addEventListener('click', () => this.publishPost());
        document.querySelector('a[href="#insert-image"]').addEventListener('click', () => this.showImageUploadModal());
        document.querySelector('a[href="#statistics"]').addEventListener('click', () => this.showStatistics());

        // Toolbar handlers
        document.querySelector('.btn-new').addEventListener('click', () => this.newPost());
        document.querySelector('.btn-save').addEventListener('click', () => this.savePost());
        document.querySelector('.btn-preview').addEventListener('click', () => this.showPreview());
        document.querySelector('.btn-publish').addEventListener('click', () => this.publishPost());
        document.querySelector('.btn-search').addEventListener('click', () => this.performSearch());

        // Search box handler
        document.getElementById('searchBox').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Create editor interface
        this.createEditorInterface();

        // Initialize modals
        this.initializeModals();
    }

    initializeModals() {
        // Create image upload modal
        const imageModalTemplate = document.getElementById('imageUploadModal');
        const imageModal = imageModalTemplate.content.cloneNode(true);
        document.body.appendChild(imageModal);

        // Create stats modal
        const statsModalTemplate = document.getElementById('statsModal');
        const statsModal = statsModalTemplate.content.cloneNode(true);
        document.body.appendChild(statsModal);

        // Add modal close handlers
        document.querySelectorAll('.modal .title-bar-controls button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
    }

    createEditorInterface() {
        const editor = document.createElement('div');
        editor.className = 'post-editor';
        editor.innerHTML = `
            <div class="field-row">
                <label>Title:</label>
                <input type="text" id="postTitle" />
            </div>
            <div class="field-row">
                <label>Categories:</label>
                <input type="text" id="postCategories" placeholder="Comma separated categories" />
            </div>
            <div class="field-row">
                <label>Tags:</label>
                <input type="text" id="postTags" placeholder="Comma separated tags" />
            </div>
            <textarea id="postContent" placeholder="Write your post in Markdown..."></textarea>
            <div class="status-bar">
                <span id="wordCount">Words: 0</span>
                <span id="readTime">Read time: 0 min</span>
            </div>
        `;
        
        document.querySelector('.blog-content').appendChild(editor);
        
        // Add autosave functionality
        const postContent = document.getElementById('postContent');
        postContent.addEventListener('input', () => {
            this.updateWordCount();
            this.autosave();
        });
    }

    newPost() {
        this.currentPost = {
            id: Date.now(),
            title: '',
            content: '',
            categories: [],
            tags: [],
            created: new Date(),
            modified: new Date(),
            draft: true
        };
        this.updateEditorWithPost();
    }

    async savePost() {
        if (!this.currentPost) return;

        this.currentPost.title = document.getElementById('postTitle').value;
        this.currentPost.content = document.getElementById('postContent').value;
        this.currentPost.categories = document.getElementById('postCategories').value
            .split(',')
            .map(cat => cat.trim())
            .filter(cat => cat);
        this.currentPost.tags = document.getElementById('postTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);
        this.currentPost.modified = new Date();

        try {
            await this.postManager.savePost(this.currentPost);
            this.updatePostList();
            this.showStatus('Post saved successfully');
        } catch (error) {
            console.error('Error saving post:', error);
            this.showError('Failed to save post');
        }
    }

    async publishPost() {
        if (!this.currentPost || !this.currentPost.draft) return;

        try {
            await this.postManager.publishPost(this.currentPost.id);
            this.currentPost.draft = false;
            this.updatePostList();
            this.showStatus('Post published successfully');
        } catch (error) {
            console.error('Error publishing post:', error);
            this.showError('Failed to publish post');
        }
    }

    setupSearchFunctionality() {
        const searchBox = document.getElementById('searchBox');
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchResults.style.display = 'none';
        searchBox.parentElement.appendChild(searchResults);

        searchBox.addEventListener('input', () => {
            if (searchBox.value.length >= 2) {
                this.showSearchResults(searchBox.value);
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchResults.contains(e.target) && e.target !== searchBox) {
                searchResults.style.display = 'none';
            }
        });
    }

    showSearchResults(query) {
        const results = this.postManager.searchPosts(query);
        const searchResults = document.querySelector('.search-results');
        
        if (results.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        searchResults.innerHTML = `<ul>${
            results.map(post => `
                <li data-id="${post.id}">
                    ${post.title || 'Untitled'}
                    ${post.draft ? '(Draft)' : ''}
                </li>
            `).join('')
        }</ul>`;

        searchResults.style.display = 'block';

        // Add click handlers to results
        searchResults.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                this.loadPost(li.dataset.id);
                searchResults.style.display = 'none';
            });
        });
    }

    updatePostList() {
        const posts = Array.from(this.postManager.posts.values());
        const postList = document.querySelector('.post-list .tree-view');
        
        postList.innerHTML = posts
            .sort((a, b) => new Date(b.modified) - new Date(a.modified))
            .map(post => `
                <li data-id="${post.id}">
                    <span class="post-title ${post.draft ? 'draft' : 'published'}">
                        ${post.title || 'Untitled'}
                    </span>
                    ${post.draft ? ' (Draft)' : ''}
                    ${post.scheduledFor ? ` (Scheduled: ${new Date(post.scheduledFor).toLocaleDateString()})` : ''}
                </li>
            `)
            .join('');

        postList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => this.loadPost(li.dataset.id));
        });

        this.updateStatistics();
    }

    async loadPost(id) {
        try {
            const post = this.postManager.posts.get(id);
            if (post) {
                this.currentPost = post;
                this.updateEditorWithPost();
            }
        } catch (error) {
            console.error('Error loading post:', error);
            this.showError('Failed to load post');
        }
    }

    updateEditorWithPost() {
        if (!this.currentPost) return;

        document.getElementById('postTitle').value = this.currentPost.title;
        document.getElementById('postContent').value = this.currentPost.content;
        document.getElementById('postCategories').value = this.currentPost.categories.join(', ');
        document.getElementById('postTags').value = this.currentPost.tags.join(', ');
        this.updateWordCount();
    }

    updateWordCount() {
        const content = document.getElementById('postContent').value;
        const wordCount = content.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200); // Average reading speed of 200 words per minute

        document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
        document.getElementById('readTime').textContent = `Read time: ${readTime} min`;
    }

    autosave() {
        if (this.autosaveTimeout) {
            clearTimeout(this.autosaveTimeout);
        }
        this.autosaveTimeout = setTimeout(() => this.savePost(), 3000);
    }

    showPreview() {
        const content = document.getElementById('postContent').value;
        const previewHtml = this.markdownToHtml(content);
        
        // Create preview window if it doesn't exist
        let previewWindow = document.querySelector('.post-preview');
        if (!previewWindow) {
            previewWindow = document.createElement('div');
            previewWindow.className = 'window post-preview';
            previewWindow.innerHTML = `
                <div class="title-bar">
                    <div class="title-bar-text">Post Preview</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close"></button>
                    </div>
                </div>
                <div class="window-body">
                    <div class="markdown-preview"></div>
                </div>
            `;
            document.body.appendChild(previewWindow);

            // Add close button handler
            previewWindow.querySelector('button[aria-label="Close"]')
                .addEventListener('click', () => {
                    previewWindow.classList.remove('active');
                });
        }

        previewWindow.querySelector('.markdown-preview').innerHTML = previewHtml;
        previewWindow.classList.add('active');
    }

    async showImageUploadModal() {
        const modal = document.querySelector('#imageUploadModal').content.cloneNode(true).firstElementChild;
        document.body.appendChild(modal);
        modal.style.display = 'block';

        const uploadButton = modal.querySelector('.btn-upload');
        const cancelButton = modal.querySelector('.btn-cancel');
        const fileInput = modal.querySelector('#imageUpload');

        uploadButton.addEventListener('click', async () => {
            const file = fileInput.files[0];
            if (file) {
                try {
                    const filename = await this.postManager.saveMedia(file);
                    const imageMarkdown = `![${file.name}](${filename})`;
                    const textarea = document.getElementById('postContent');
                    const pos = textarea.selectionStart;
                    textarea.value = textarea.value.slice(0, pos) + imageMarkdown + textarea.value.slice(pos);
                    modal.remove();
                } catch (error) {
                    console.error('Error uploading image:', error);
                    this.showError('Failed to upload image');
                }
            }
        });

        cancelButton.addEventListener('click', () => modal.remove());
    }

    showStatistics() {
        const stats = this.postManager.getStats();
        const statsModal = document.querySelector('#statsModal').content.cloneNode(true).firstElementChild;
        document.body.appendChild(statsModal);

        const statsContainer = statsModal.querySelector('#blogStats');
        statsContainer.innerHTML = `
            <div><label>Total Posts:</label> <span>${stats.totalPosts}</span></div>
            <div><label>Published:</label> <span>${stats.publishedCount}</span></div>
            <div><label>Drafts:</label> <span>${stats.draftCount}</span></div>
            <div><label>Categories:</label> <span>${stats.categoryCount}</span></div>
            <div><label>Tags:</label> <span>${stats.tagCount}</span></div>
        `;

        statsModal.style.display = 'block';
    }

    showError(message) {
        // Create Windows 95 style error dialog
        const errorDialog = document.createElement('div');
        errorDialog.className = 'window modal error-dialog';
        errorDialog.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">Error</div>
                <div class="title-bar-controls">
                    <button aria-label="Close"></button>
                </div>
            </div>
            <div class="window-body">
                <p>${message}</p>
                <div class="field-row" style="justify-content: flex-end">
                    <button>OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(errorDialog);
        errorDialog.style.display = 'block';

        const closeButton = errorDialog.querySelector('button');
        closeButton.addEventListener('click', () => errorDialog.remove());
    }

    showStatus(message) {
        const statusBar = document.createElement('div');
        statusBar.className = 'status-message';
        statusBar.textContent = message;
        document.body.appendChild(statusBar);

        setTimeout(() => statusBar.remove(), 3000);
    }

    markdownToHtml(markdown) {
        // Enhanced markdown parser
        return markdown
            // Headers
            .replace(/#{6}\s?([^\n]+)/g, '<h6>$1</h6>')
            .replace(/#{5}\s?([^\n]+)/g, '<h5>$1</h5>')
            .replace(/#{4}\s?([^\n]+)/g, '<h4>$1</h4>')
            .replace(/#{3}\s?([^\n]+)/g, '<h3>$1</h3>')
            .replace(/#{2}\s?([^\n]+)/g, '<h2>$1</h2>')
            .replace(/#{1}\s?([^\n]+)/g, '<h1>$1</h1>')
            // Emphasis
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Links and images
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
            // Code
            .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Lists
            .replace(/^\s*[-*+]\s+(.+)/gm, '<li>$1</li>')
            .replace(/(<li>[^<]+<\/li>\n?)+/g, '<ul>$&</ul>')
            .replace(/^\s*\d+\.\s+(.+)/gm, '<li>$1</li>')
            .replace(/(<li>[^<]+<\/li>\n?)+/g, '<ol>$&</ol>')
            // Blockquotes
            .replace(/^\s*>\s(.+)/gm, '<blockquote>$1</blockquote>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .trim();
    }
}

// Initialize the blog system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogSystem = new BlogSystem();
});