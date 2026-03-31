const express = require('express');
const router = express.Router();
const Record = require('../models/record');

// Route to check in an employee
router.post('/checkin', async (req, res) => {
    console.log('Check-in route hit');
    const checkInTime = new Date();

    try {
        console.log('Creating record...');
        const record = new Record({
            checkInTime,
            checkOutTime: null,
            date: checkInTime.toISOString().split('T')[0]
        });
        console.log('Saving record...');
        await record.save();
        console.log('Record saved successfully');
        res.status(201).json({ message: 'Check-in recorded', record });
    } catch (error) {
        console.error('Error recording check-in:', error);
        res.status(500).json({ message: 'Error recording check-in', error: error.message });
    }
});

// Route to check out an employee
router.post('/checkout', async (req, res) => {
    console.log('Check-out route hit');
    const checkOutTime = new Date();

    try {
        console.log('Finding and updating record...');
        const record = await Record.findOneAndUpdate(
            { date: checkOutTime.toISOString().split('T')[0], checkOutTime: null },
            { checkOutTime },
            { new: true }
        );

        if (!record) {
            console.log('No record found for check-out');
            return res.status(404).json({ message: 'No check-in record found for today' });
        }

        console.log('Check-out recorded successfully');
        res.status(200).json({ message: 'Check-out recorded', record });
    } catch (error) {
        console.error('Error recording check-out:', error);
        res.status(500).json({ message: 'Error recording check-out', error: error.message });
    }
});

// Route to get attendance records
router.get('/records', async (req, res) => {
    console.log('Records route hit');
    try {
        const records = await Record.find();
        console.log('Records found:', records.length);
        res.status(200).json(records);
    } catch (error) {
        console.error('Error retrieving records:', error);
        res.status(500).json({ message: 'Error retrieving records', error });
    }
});

module.exports = router;