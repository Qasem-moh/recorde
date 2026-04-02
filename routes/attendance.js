const express = require('express');
const router = express.Router();
const Record = require('../models/record');

// Route to get all attendance records
router.get('/', async (req, res) => {
    try {
        const records = await Record.find();
        res.status(200).json(records);
    } catch (error) {
        console.error('❌ GET /api/attendance error:', error);
        const errorDetails = typeof error === 'object' ? JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))) : error;
        res.status(500).json({
            message: 'Error retrieving records',
            error: errorDetails,
            stack: error.stack || null,
        });
    }
});

// Route to check in an employee
router.post('/checkin', async (req, res) => {
    try {
        const checkInTime = new Date();

        const record = new Record({
            checkInTime,
            checkOutTime: null,
            date: checkInTime.toISOString().split('T')[0]
        });
        await record.save();
        res.status(201).json({
            message: 'Check-in recorded',
            record,
            success: true
        });
    } catch (error) {
        console.error('❌ POST /api/attendance/checkin error:', error);
        const errorDetails = typeof error === 'object' ? JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))) : error;
        res.status(500).json({
            message: 'Error recording check-in',
            error: errorDetails,
            stack: error.stack || null,
            success: false
        });
    }
});

// Route to check out an employee
router.post('/checkout', async (req, res) => {
    try {
        const checkOutTime = new Date();

        const record = await Record.findOneAndUpdate(
            { date: checkOutTime.toISOString().split('T')[0], checkOutTime: null },
            { checkOutTime },
            { returnDocument: 'after' }
        );

        if (!record) {
            return res.status(404).json({
                message: 'No check-in record found for today',
                success: false
            });
        }

        res.status(200).json({
            message: 'Check-out recorded',
            record,
            success: true
        });
    } catch (error) {
        console.error('❌ POST /api/attendance/checkout error:', error);
        const errorDetails = typeof error === 'object' ? JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))) : error;
        res.status(500).json({
            message: 'Error recording check-out',
            error: errorDetails,
            stack: error.stack || null,
            success: false
        });
    }
});

module.exports = router;