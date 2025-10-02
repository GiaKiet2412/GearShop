const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');

// API để đăng nhập admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username, password });
        if (!admin) {
            return res.status(401).json({ message: 'Sai tên người dùng hoặc mật khẩu' });
        }

        res.status(200).json({ message: 'Đăng nhập thành công', admin: { username: admin.username } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;