const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const attendanceRoutes = require('./src/routes/attendance');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
mongoose.connect('mongodb+srv://qasem:qmfn1993@cluster0.a1tuldd.mongodb.net/attendance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// mongoose.connect('mongodb+srv://qasem:qmfn1993@cluster0.a1tuldd.mongodb.net/?appName=', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/attendance', attendanceRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});