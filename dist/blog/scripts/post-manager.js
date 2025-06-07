class PostManager {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
        this.posts = new Map();
        this.categories = new Set();
        this.tags = new Set();
    }

    async initialize() {
        await this.ensureDirectoryStructure();
        await this.loadAllPosts();
        this.updateMetadata();
    }

    async ensureDirectoryStructure() {
        const directories = ['posts', 'drafts', 'media'];
        for (const dir of directories) {
            try {
                await this.fileSystem.mkdir(dir);
            } catch (error) {
                if (error.code !== 'EEXIST') {
                    console.error(`Error creating directory ${dir}:`, error);
                }
            }
        }
    }

    async loadAllPosts() {
        try {
            const postFiles = await this.fileSystem.readdir('posts');
            const draftFiles = await this.fileSystem.readdir('drafts');
            
            const loadPromises = [
                ...postFiles.map(file => this.loadPost('posts', file)),
                ...draftFiles.map(file => this.loadPost('drafts', file))
            ];

            await Promise.all(loadPromises);
        } catch (error) {
            console.error('Error loading posts:', error);
            throw error;
        }
    }

    async loadPost(directory, filename) {
        if (!filename.endsWith('.json')) return;

        try {
            const content = await this.fileSystem.readFile(`${directory}/${filename}`);
            const post = JSON.parse(content);
            this.posts.set(post.id, post);
        } catch (error) {
            console.error(`Error loading post ${filename}:`, error);
        }
    }

    updateMetadata() {
        this.categories.clear();
        this.tags.clear();

        for (const post of this.posts.values()) {
            post.categories.forEach(category => this.categories.add(category));
            post.tags.forEach(tag => this.tags.add(tag));
        }
    }

    async savePost(post) {
        const directory = post.draft ? 'drafts' : 'posts';
        const filename = `${directory}/${post.id}.json`;

        try {
            await this.fileSystem.writeFile(filename, JSON.stringify(post, null, 2));
            this.posts.set(post.id, post);
            this.updateMetadata();
            return true;
        } catch (error) {
            console.error('Error saving post:', error);
            throw error;
        }
    }

    async deletePost(postId) {
        const post = this.posts.get(postId);
        if (!post) return false;

        const directory = post.draft ? 'drafts' : 'posts';
        try {
            await this.fileSystem.unlink(`${directory}/${postId}.json`);
            this.posts.delete(postId);
            this.updateMetadata();
            return true;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }

    async publishPost(postId) {
        const post = this.posts.get(postId);
        if (!post || !post.draft) return false;

        try {
            // Delete from drafts
            await this.fileSystem.unlink(`drafts/${postId}.json`);
            
            // Update post status
            post.draft = false;
            post.publishedAt = new Date();
            
            // Save to posts directory
            await this.savePost(post);
            return true;
        } catch (error) {
            console.error('Error publishing post:', error);
            throw error;
        }
    }

    async saveMedia(file) {
        try {
            const filename = `media/${Date.now()}_${file.name}`;
            await this.fileSystem.writeFile(filename, file);
            return filename;
        } catch (error) {
            console.error('Error saving media:', error);
            throw error;
        }
    }

    getPostsByCategory(category) {
        return Array.from(this.posts.values())
            .filter(post => post.categories.includes(category));
    }

    getPostsByTag(tag) {
        return Array.from(this.posts.values())
            .filter(post => post.tags.includes(tag));
    }

    searchPosts(query) {
        const searchTerms = query.toLowerCase().split(' ');
        return Array.from(this.posts.values())
            .filter(post => {
                const searchText = `${post.title} ${post.content} ${post.categories.join(' ')} ${post.tags.join(' ')}`.toLowerCase();
                return searchTerms.every(term => searchText.includes(term));
            });
    }

    getAllCategories() {
        return Array.from(this.categories);
    }

    getAllTags() {
        return Array.from(this.tags);
    }

    getStats() {
        const publishedPosts = Array.from(this.posts.values()).filter(post => !post.draft);
        const draftPosts = Array.from(this.posts.values()).filter(post => post.draft);

        return {
            totalPosts: this.posts.size,
            publishedCount: publishedPosts.length,
            draftCount: draftPosts.length,
            categoryCount: this.categories.size,
            tagCount: this.tags.size
        };
    }
}

// Export for use in blog.js
window.PostManager = PostManager;