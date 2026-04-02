const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 3000;

// Get the correct root directory
const rootDir = path.resolve(__dirname);
const publicDir = path.join(rootDir, 'public');
const nodeEnv = process.env.NODE_ENV || 'development';

console.log('Root directory:', rootDir);
console.log('Public directory path:', publicDir);
console.log('Public directory exists:', fs.existsSync(publicDir));
console.log('NODE_ENV:', nodeEnv);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(publicDir));

// Keep-alive endpoint for Render (prevents service from sleeping)
app.get('/ping', (req, res) => {
    res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
});

// Debug: Log directory info
if (fs.existsSync(publicDir)) {
    console.log('✓ Files in public:', fs.readdirSync(publicDir));
} else {
    console.log('⚠️  Public directory not found');
}

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://qasem:qmfn1993@cluster0.a1tuldd.mongodb.net/attendance?retryWrites=true&w=majority';

if (!mongoURI) {
    console.error('❌ MONGODB_URI is not defined');
    process.exit(1);
}

if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.error('❌ MONGODB_URI environment variable is not set in production.');
    console.error('Set MONGODB_URI in Render dashboard to your Atlas connection string.');
    process.exit(1);
}

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    maxPoolSize: 10, // Maintain up to 10 socket connections
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0, // Disable mongoose buffering
})
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    });

mongoose.connection.on('connected', () => console.log('✓ MongoDB connection open.'));
mongoose.connection.on('error', err => console.error('✗ MongoDB connection error (event):', err.message));
mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected.'));

// Routes
app.use('/api/attendance', attendanceRoutes);

// Health check endpoint for Render
app.get('/health', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.status(isDbConnected ? 200 : 503).json({
        status: isDbConnected ? 'healthy' : 'unhealthy',
        database: isDbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve React app only in production (after building)
if (nodeEnv === 'production') {
    app.get('*', (req, res) => {
        const indexPath = path.join(publicDir, 'index.html');
        console.log('Request for:', req.path);
        console.log('Trying to serve from:', indexPath);
        console.log('File exists:', fs.existsSync(indexPath));
        
        // Check if public directory exists
        if (!fs.existsSync(publicDir)) {
            console.error('❌ Public directory not found at:', publicDir);
            console.error('Contents of root:', fs.readdirSync(rootDir));
            return res.status(500).json({ 
                error: 'Build files not found. Ensure npm run build completed successfully.',
                publicDir: publicDir,
                exists: false,
                rootContents: fs.readdirSync(rootDir)
            });
        }
        
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('❌ Error serving index.html:', err.message);
                console.log('✓ Public directory contents:', fs.readdirSync(publicDir));
                res.status(404).json({ error: 'index.html not found' });
            }
        });
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${publicDir}`);
    console.log(`🌍 Environment: ${nodeEnv.toUpperCase()}`);
    if (nodeEnv === 'production') {
        console.log('🚀 React app will be served from build files');
    } else {
        console.log('🔧 Development mode - API calls proxied through Vite');
    }
});