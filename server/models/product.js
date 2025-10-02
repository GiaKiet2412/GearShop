const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Name: String,
    Description: String,
    Price: Number,
    Img: String,
    Type: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    Brand: String,
    Stock: { type: Number, required: true },
    Sold: { type: Number, default: 0 }
}, { collection: 'product' });

module.exports = mongoose.model('Product', productSchema);