const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://qasem:qmfn1993@cluster0.a1tuldd.mongodb.net/attendance';
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
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});