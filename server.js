const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Debug: Log directory info
console.log('Current directory:', __dirname);
console.log('Public folder exists:', fs.existsSync(path.join(__dirname, 'public')));
if (fs.existsSync(path.join(__dirname, 'public'))) {
    console.log('Files in public:', fs.readdirSync(path.join(__dirname, 'public')));
}

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance';
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
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        const indexPath = path.join(__dirname, 'public', 'index.html');
        console.log('Request for:', req.path);
        console.log('Serving from:', indexPath);
        console.log('File exists:', fs.existsSync(indexPath));
        
        // Check if public directory exists
        const publicDir = path.join(__dirname, 'public');
        if (!fs.existsSync(publicDir)) {
            console.error('Public directory not found at:', publicDir);
            return res.status(500).json({ 
                error: 'Build files not found. Ensure npm run build completed successfully.',
                publicDir: publicDir,
                exists: false 
            });
        }
        
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('Error serving index.html:', err);
                res.status(404).json({ error: 'index.html not found' });
            }
        });
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});