const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    Name: { type: String, unique: true },
    Email: { type: String, unique: true }, 
    Phone: Number,
    Address: String,
    Password: String,
    VerificationCode: String, // Thêm trường này để lưu mã xác minh
}, { collection: 'customer' });

module.exports = mongoose.model('Customer', customerSchema);