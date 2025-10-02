// server/routes/discountcode.js
const express = require('express');
const router = express.Router();
const Discountcode = require('../models/discountcode');

router.get('/', async (req, res) => {
    try {
        const discountCodes = await Discountcode.find();
        res.json(discountCodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;