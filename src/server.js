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
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
// mongoose.connect('mongodb+srv://qasem:qmfn1993@cluster0.a1tuldd.mongodb.net/attendance', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })

mongoose.connect('mongodb+srv://qasem:qmfn1993@cluster0.a1tuldd.mongodb.net/attendance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('https://recorde.onrender.com', attendanceRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});