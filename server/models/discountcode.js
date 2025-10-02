const mongoose = require('mongoose'); // Corrected this line

const discountSchema = new mongoose.Schema({
    codename: String,
    percent: Number,
    description: String
}, { collection: 'discountcode' });

module.exports = mongoose.model('Discountcode', discountSchema);