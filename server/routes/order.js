const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Nhập mongoose
const Order = require('../models/order');
const Product = require('../models/product');

// API tạo hóa đơn
router.post('/', async (req, res) => {
    const { user, products, totalPrice, method, status } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!user || !products || !totalPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = new Order({ user, products, totalPrice, method, status });

    try {
        await newOrder.save(); // Lưu đơn hàng
        console.log(`Order saved successfully: ${newOrder._id}`);

        // Cập nhật số lượng sản phẩm và số lượng đã bán
        for (const product of products) {
            // Log thông tin sản phẩm để kiểm tra
            console.log(`Updating product with ID: ${product.productId}, Quantity: ${product.quantity}`);

            const updateResponse = await Product.findByIdAndUpdate(
                product.productId,
                {
                    $inc: {
                        Stock: -product.quantity,
                        Sold: product.quantity
                    }
                },
                { new: true }
            );

            // Kiểm tra kết quả cập nhật
            if (updateResponse) {
                console.log(`Updated product: ${JSON.stringify(updateResponse)}`);
            } else {
                console.log(`Product with ID ${product.productId} not found.`);
                return res.status(404).json({ error: `Product with ID ${product.productId} not found.` });
            }
        }

        res.status(201).json({ message: 'Order created successfully', orderId: newOrder._id });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API lịch sử hóa đơn theo tên người dùng
router.get('/name/:name', async (req, res) => {
    try {
        const orders = await Order.find({ 'user.Name': req.params.name }).populate('products.productId');
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders by name:', err);
        res.status(500).json({ message: err.message });
    }
});

// API để lấy tất cả đơn hàng trang admin
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId');
        res.json(orders);
    } catch (err) {
        console.error('Error fetching all orders:', err);
        res.status(500).json({ message: err.message });
    }
});

// API để hủy đơn hàng và hoàn lại số lượng
router.put('/:id', async (req, res) => {
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "ID đơn hàng không hợp lệ." });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
        }

        if (order.status !== 'Chưa được xác nhận') {
            return res.status(400).json({ message: "Chỉ có thể hủy đơn hàng chưa được xác nhận" });
        }

        // Hoàn lại số lượng sản phẩm
        await Promise.all(order.products.map(async (product) => {
            if (mongoose.Types.ObjectId.isValid(product.productId)) {
                await Product.findByIdAndUpdate(
                    new mongoose.Types.ObjectId(product.productId),
                    { $inc: { Stock: product.quantity } }
                );                
            }
        }));

        // Cập nhật trạng thái đơn hàng
        order.status = status || 'Đơn hàng đã hủy';
        await order.save();

        res.json({ message: 'Đơn hàng đã được hủy thành công', order });
    } catch (err) {
        console.error("Lỗi server khi hủy đơn hàng:", err);
        res.status(500).json({ message: 'Lỗi server khi hủy đơn hàng', error: err.message });
    }
});

// API để xác nhận đơn hàng
router.put('/confirm/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: 'Đã được xác nhận' }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
        }
        res.json(updatedOrder);
    } catch (err) {
        console.error('Error confirming order:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;