const express = require('express');
const router = express.Router();
const Record = require('../models/record');

// Route to get all attendance records
router.get('/', async (req, res) => {
    try {
        const records = await Record.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving records', error });
    }
});

// Route to check in an employee
router.post('/checkin', async (req, res) => {
    const checkInTime = new Date();

    try {
        const record = new Record({
            checkInTime,
            checkOutTime: null,
            date: checkInTime.toISOString().split('T')[0]
        });
        await record.save();
        res.status(201).json({ message: 'Check-in recorded', record });
    } catch (error) {
        res.status(500).json({ message: 'Error recording check-in', error });
    }
});

// Route to check out an employee
router.post('/checkout', async (req, res) => {

    const checkOutTime = new Date();

    try {
        const record = await Record.findOneAndUpdate(
            { date: checkOutTime.toISOString().split('T')[0], checkOutTime: null },
            { checkOutTime },
            { returnDocument: 'after' }
        );

        if (!record) {
            return res.status(404).json({ message: 'No check-in record found for today' });
        }

        res.status(200).json({ message: 'Check-out recorded', record });
    } catch (error) {
        res.status(500).json({ message: 'Error recording check-out', error });
    }
});

module.exports = router;