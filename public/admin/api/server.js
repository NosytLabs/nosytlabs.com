const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset maxAge on every request
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour session timeout
        sameSite: 'strict'
    }
}));

// Session timeout middleware
app.use((req, res, next) => {
    if (req.session.userId && req.session.cookie.expires < new Date()) {
        req.session.destroy();
        return res.status(401).json({ error: 'Session expired' });
    }
    next();
});

// Mock database (replace with real database in production)
const users = [
    {
        id: 1,
        username: 'admin',
        // Default password: admin123 (hashed)
        password: '$2a$10$KgGzKFgPZ8nFr5yw8CxPd.YzQKKA6V4BDFYz.RoFIDKj0MW/a8TKm',
        role: 'admin'
    }
];

// Auth middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;
    res.json({ success: true });
});

app.get('/api/auth/check', requireAuth, (req, res) => {
    res.json({ authenticated: true });
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Dashboard routes
app.get('/api/admin/dashboard', requireAuth, (req, res) => {
    res.json({
        stats: {
            activeUsers: 150,
            pendingBookings: 12,
            newMessages: 5
        },
        recentActivity: {
            lastLogin: new Date(),
            lastBooking: new Date(Date.now() - 2 * 60 * 60 * 1000),
            lastContentUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        systemStatus: {
            server: 'online',
            database: 'connected',
            lastBackup: new Date()
        }
    });
});

// Content management routes
app.get('/api/admin/content', requireAuth, (req, res) => {
    res.json({
        posts: [],
        pages: [],
        media: []
    });
});

app.post('/api/admin/content', requireAuth, (req, res) => {
    // Handle content creation
    res.json({ success: true });
});

// Booking management routes
app.get('/api/admin/bookings', requireAuth, (req, res) => {
    res.json({
        bookings: []
    });
});

app.post('/api/admin/bookings', requireAuth, (req, res) => {
    // Handle booking creation/update
    res.json({ success: true });
});

// Analytics routes
app.get('/api/admin/analytics', requireAuth, (req, res) => {
    res.json({
        traffic: [],
        revenue: [],
        metrics: {}
    });
});

// User management routes
app.get('/api/admin/users', requireAuth, (req, res) => {
    const sanitizedUsers = users.map(({ password, ...user }) => user);
    res.json({ users: sanitizedUsers });
});

app.post('/api/admin/users', requireAuth, (req, res) => {
    // Handle user creation
    res.json({ success: true });
});

// Settings routes
app.get('/api/admin/settings', requireAuth, (req, res) => {
    res.json({
        siteSettings: {},
        emailSettings: {},
        backupSettings: {}
    });
});

app.post('/api/admin/settings', requireAuth, (req, res) => {
    // Handle settings update
    res.json({ success: true });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Admin API server running on port ${PORT}`);
});
