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

// Debug: Log directory info
if (fs.existsSync(publicDir)) {
    console.log('✓ Files in public:', fs.readdirSync(publicDir));
} else {
    console.log('⚠️  Public directory not found');
}

// Database connection
const mongoURI = process.env.MONGODB_URI || ' mongodb+srv://qasem:qmfn1993@cluster0.a1tuldd.mongodb.net/attendance';
mongoose.connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})

// mongoose.connect('mongodb+srv://qasem:qmfn1993@cluster0.a1tuldd.mongodb.net/?appName=', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/attendance', attendanceRoutes);

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