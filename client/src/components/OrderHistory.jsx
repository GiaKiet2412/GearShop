import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Menu from '../components/Menu';
import '../css/OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [ratings, setRatings] = useState([]);
    const navigate = useNavigate();
    const userName = JSON.parse(localStorage.getItem('user')).Name;
    const userId = JSON.parse(localStorage.getItem('user'))._id; // Lấy userId

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/orders/name/${userName}`);
                setOrders(response.data);
    
                const ratingsPromises = response.data.map(order =>
                    axios.get(`http://localhost:5000/api/v1/ratings/order-ratings/${order._id}/${userId}`)
                );
    
                const ratingsResponses = await Promise.all(ratingsPromises);
                const allRatings = ratingsResponses.flatMap(res => res.data);
                setRatings(allRatings);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", error);
                alert("Lỗi khi lấy danh sách đơn hàng: " + error.message);
            }
        };
    
        if (!userName) {
            alert("Bạn cần đăng nhập để xem lịch sử mua hàng.");
            navigate('/login');
        } else {
            fetchOrders();
        }
    }, [userName, navigate, userId]);

    const handleCancelOrder = async (orderId, products) => {
        const order = orders.find(order => order._id === orderId);
        
        if (order.status !== 'Chưa được xác nhận') {
            alert('Chỉ có thể hủy đơn hàng chưa được xác nhận.');
            return;
        }
    
        try {
            await axios.put(`http://localhost:5000/api/v1/orders/${orderId}`, { status: 'Đơn hàng đã hủy' });
            await Promise.all(products.map(product => {
                return axios.put(`http://localhost:5000/api/v1/product/${product.productId}`, {
                    stock: product.quantity
                });
            }));
    
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, status: 'Đơn hàng đã hủy' } : order
            ));
            
            alert('Đơn hàng đã được hủy thành công.');
        } catch {
            alert('Đơn hàng đã được hủy thành công.');
        }
    };

    return (
        <div className="order-history">
            <Header />
            <Menu />
            <h1 className="order-history__title">Lịch sử mua hàng</h1>
            {orders.length === 0 ? (
                <p className="order-history__empty">Không có đơn hàng nào.</p>
            ) : (
                <ul className="order-history__list">
                    {orders.map(order => (
                        <li key={order._id} className="order-history__item">
                            <h3 className="order-history__order-id">Đơn hàng ID: {order._id}</h3>
                            <p className="order-history__total-price">Tổng tiền: {order.totalPrice.toLocaleString("vi-VN")} VNĐ</p>
                            <p className="order-history__status">Phương thức: {order.method}</p>
                            <p className="order-history__status">Tình trạng: {order.status}</p>
                            <p className="order-history__date">Ngày đặt: {new Date(order.createdAt).toLocaleString()}</p>
                            <p className="order-history__status">Địa chỉ: {order.user.address}</p>
                            <h4 className="order-history__product-title">Chi tiết sản phẩm:</h4>
                            <ul className="order-history__product-list">
                                {order.products.map(product => (
                                    <li key={product._id} className="order-history__product-item">
                                        {product.name} - {product.quantity} x {product.price.toLocaleString("vi-VN")} VNĐ {product.selectedSize && ` (Kích cỡ: ${product.selectedSize})`}
                                        {product.selectedToppings && product.selectedToppings.length > 0 && (
                                            <div className="order-history__toppings">
                                                Topping: {product.selectedToppings.join(', ')}
                                            </div>
                                        )}
                                        {order.status === 'Đã được xác nhận' && !ratings.some(rating => rating.productId.toString() === product.productId._id.toString()) && (
                                            <button 
                                                className="order-history__cancel-button" 
                                                onClick={() => navigate(`/rate-order/${order._id}/${product.productId._id}`)}
                                            >
                                                Đánh giá
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {order.status === 'Chưa được xác nhận' && (
                                <button className="order-history__cancel-button" onClick={() => handleCancelOrder(order._id, order.products)}>
                                    Hủy đơn hàng
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;