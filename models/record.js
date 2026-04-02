const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date, default: null },
    date: { type: String, required: true }
});

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);