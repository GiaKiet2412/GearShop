const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const emailjs = require('emailjs-com'); 

// API để kiểm tra tên và email người dùng đã tồn tại hay chưa
router.post('/check-user', async (req, res) => {
    const { name, email } = req.body;
    try {
        const existingCustomerByName = await Customer.findOne({ Name: name });
        const existingCustomerByEmail = await Customer.findOne({ Email: email });
        
        if (existingCustomerByName || existingCustomerByEmail) {
            return res.status(200).json({ available: false });
        }
        res.status(200).json({ available: true });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    }
});

// API để đăng ký
router.post('/register', async (req, res) => {
    const { name, email, phone, address, password, verificationCode } = req.body;
    try {
        const existingCustomer = await Customer.findOne({ Email: email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email đã được sử dụng. Vui lòng chọn email khác.' });
        }

        // Lưu thông tin khách hàng vào cơ sở dữ liệu
        const newCustomer = new Customer({
            Name: name,
            Email: email,
            Phone: phone,
            Address: address,
            Password: password,
            VerificationCode: verificationCode // Lưu mã xác minh
        });

        await newCustomer.save(); // Lưu thông tin khách hàng
        res.status(201).json({ message: 'Tài khoản đã được tạo thành công! Bạn có thể đăng nhập.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Hàm gửi email xác nhận qua EmailJS
const sendVerificationEmail = async (email, verificationCode) => {
    const templateParams = {
        to_email: email,
        verification_code: verificationCode,
    };

    return emailjs.send('service_wgo5m5a', 'template_duq3z3e', templateParams, '7oV_vV7xwhrwQvsb9'); // Thay 'user_your_user_id' bằng user ID của bạn từ EmailJS
};

// API để xác minh mã
router.post('/verify', async (req, res) => {
    const { email, verificationCode } = req.body;
    try {
        const customer = await Customer.findOne({ Email: email });

        if (!customer) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        if (customer.VerificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Mã xác nhận không chính xác.' });
        }

        // Nếu mã xác nhận đúng, lưu tài khoản vào cơ sở dữ liệu
        const newCustomer = new Customer({
            Name: customer.Name,
            Email: customer.Email,
            Phone: customer.Phone,
            Address: customer.Address,
            Password: customer.Password,
            VerificationCode: undefined // Xóa mã xác nhận
        });

        await newCustomer.save(); // Lưu thông tin khách hàng

        res.status(200).json({ message: 'Đăng ký thành công! Bạn có thể đăng nhập.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// API để đăng nhập
router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const customer = await Customer.findOne({ Name: name, Password: password });
        if (!customer) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }
        res.status(200).json({ message: 'Đăng nhập thành công', customer: { 
            _id: customer._id,  // Thêm trường _id vào đây
            Name: customer.Name 
        }});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API để lấy danh sách khách hàng
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;