import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { CartContext } from '../components/CartContext';
import '../css/Cart.css';

const Cart = () => {
    const { increaseQuantity, decreaseQuantity, removeFromCart, updateCartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [showDiscountOverlay, setShowDiscountOverlay] = useState(false);
    const [discountCodes, setDiscountCodes] = useState([]);
    const [enteredDiscountCode, setEnteredDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setSelectedProducts(storedCart);
        fetchDiscountCodes();
    }, []);

    const fetchDiscountCodes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/discountcode');
            setDiscountCodes(response.data);
        } catch (error) {
            console.error('Error fetching discount codes:', error);
        }
    };

    const handleRemoveFromCart = (productId) => {
        removeFromCart(productId);
        setSelectedProducts(selectedProducts.filter(item => item.productId !== productId));
    };

    const handleIncreaseQuantity = (productId) => {
        increaseQuantity(productId);
        setSelectedProducts(prev => 
            prev.map(item => 
                item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecreaseQuantity = (productId) => {
        decreaseQuantity(productId);
        setSelectedProducts(prev => 
            prev.map(item => 
                item.productId === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const totalMoney = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0) - discountAmount;
    };

    const handlePayment = async (isCashOnDelivery = false) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert("Bạn cần đăng nhập để thực hiện thanh toán.");
            navigate('/login');
            return;
        }
    
        try {
            if (selectedProducts.length === 0) {
                alert("Giỏ hàng của bạn trống. Không thể thanh toán.");
                return;
            }
    
            const total = totalMoney(selectedProducts);
            if (total < 5000 || total >= 1000000000) {
                alert("Số tiền giao dịch không hợp lệ.");
                return;
            }
    
            const orderData = {
                user: {
                    ...JSON.parse(storedUser),
                    name: customerName,
                    address: customerAddress,
                },
                products: selectedProducts.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    name: item.productName,
                    price: item.price,
                    selectedSize: item.selectedSize,
                    selectedToppings: item.selectedToppings
                })),
                totalPrice: total,
                method: isCashOnDelivery ? 'Thanh toán sau khi nhận hàng' : 'Thanh toán qua ngân hàng',
                status: isCashOnDelivery ? 'Chưa được xác nhận' : 'Đã được xác nhận',
            };
    
            // Gọi API tạo đơn hàng
            const response = await axios.post('http://localhost:5000/api/v1/orders/', orderData);
            console.log('Order response:', response.data); // Kiểm tra phản hồi
    
            if (isCashOnDelivery) {
                alert('Đặt hàng thành công!');
                setSelectedProducts([]);
                localStorage.removeItem('cart');
                updateCartCount(0);
                navigate('/orders');
            } else {
                const paymentResponse = await axios.post("http://localhost:5000/api/v1/vnpay/create_payment_url", {
                    amount: total,
                    language: "vn",
                });
    
                if (paymentResponse.status === 200 && paymentResponse.data) {
                    alert('Đang chuyển đến trang thanh toán...');
                    window.location.href = paymentResponse.data;
                }
            }
        } catch (error) {
            console.error('Lỗi trong quá trình thanh toán:', error);
            alert(`LỖI: ${error.message}`);
        }
    };

    const applyDiscount = () => {
        const discountCode = discountCodes.find(code => code.codename === enteredDiscountCode);
        if (discountCode) {
            const discount = (totalMoney(selectedProducts) * discountCode.percent) / 100;
            setDiscountAmount(discount);
            alert(`Mã giảm giá ${enteredDiscountCode} đã được áp dụng! Giảm ${discountCode.percent}%`);
        } else {
            alert("Mã giảm giá không hợp lệ.");
            setDiscountAmount(0);
        }
    };

    const discount = () => {
        setShowDiscountOverlay(true);
    };

    const closeOverlay = () => {
        setShowDiscountOverlay(false);
    };

    return (
        <div>
            <Header />
            <Menu />
            <div className="cartt">
                <h1 className="giohang">Giỏ hàng</h1>
                {selectedProducts.length === 0 ? (
                    <p className="giohang">Giỏ hàng của bạn trống.</p>
                ) : (
                    <div className="cart-container">
                        <div className="cart-items">
                            {selectedProducts.map(item => (
                                <div key={item.productId} className="cart-item">
                                    <img src={`/${item.image}`} alt={item.productName} />
                                    <div className="cart-item-details">
                                        <h3>{item.productName}</h3>
                                        <p>Giá: {item.price.toLocaleString("vi-VN")} đ (Size: {item.selectedSize})</p>
                                        {item.selectedToppings.length > 0 && (
                                            <p>Topping: {item.selectedToppings.join(", ")}</p>
                                        )}
                                        <div className="quantity-control">
                                            <button className="quantity-button" onClick={() => handleDecreaseQuantity(item.productId)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button className="quantity-button" onClick={() => handleIncreaseQuantity(item.productId)}>+</button>
                                        </div>
                                        <button className="remove-button" onClick={() => handleRemoveFromCart(item.productId)}>Xóa</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-summary">
                            <h2>Tổng tiền: {totalMoney(selectedProducts).toLocaleString("vi-VN")} VNĐ</h2>
                            <input 
                                type="text" 
                                placeholder="Họ tên" 
                                value={customerName} 
                                onChange={(e) => setCustomerName(e.target.value)} 
                            />
                            <input 
                                type="text" 
                                placeholder="Địa chỉ" 
                                value={customerAddress} 
                                onChange={(e) => setCustomerAddress(e.target.value)} 
                            />
                            <input
                                type="text"
                                placeholder="Mã giảm giá"
                                value={enteredDiscountCode}
                                onChange={(e) => setEnteredDiscountCode(e.target.value)}
                            />
                            <button className="discount-button" onClick={applyDiscount}>Áp dụng mã giảm giá</button>
                            <button className="discount-button" onClick={discount}>Mã giảm giá của tôi</button>
                            <button className="checkout-button" onClick={() => handlePayment()}>Thanh toán qua ngân hàng</button>
                            <button className="checkout-button" onClick={() => handlePayment(true)}>Thanh toán sau khi nhận hàng</button>
                        </div>
                    </div>
                )}
                {showDiscountOverlay && (
                    <div className="overlay">
                        <div className="overlay-content">
                            <h2>Mã Giảm Giá</h2>
                            {discountCodes.length > 0 ? (
                                <ul>
                                    {discountCodes.map(discountcode => (
                                        <li key={discountcode.codename}>
                                            Mã giảm giá của bạn: <strong>{discountcode.codename}</strong> -- {discountcode.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Chưa có mã giảm giá nào được cung cấp.</p>
                            )}
                            <div className="overlay-button">
                                <button onClick={closeOverlay}>Đóng</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;