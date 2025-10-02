import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import '../css/AdminOrderHistory.css'; 

const AdminOrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/orders');
                setOrders(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleConfirmOrder = async (orderId) => {
        try {
            await axios.put(`http://localhost:5000/api/v1/orders/confirm/${orderId}`);

            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, status: 'Đã được xác nhận' } : order
            ));
            alert('Đơn hàng đã được xác nhận.');
        } catch (error) {
            console.error('Lỗi khi xác nhận đơn hàng:', error);
            alert('Có lỗi xảy ra khi xác nhận đơn hàng.');
        }
    };

    if (loading) return <div className="adminorders-loading">Loading...</div>;
    if (error) return <div className="adminorders-error">Error: {error}</div>;

    return (
        <div className="adminorders-container">
            <AdminHeader />
            <h1 className="adminorders-title">DANH SÁCH HÓA ĐƠN</h1>
            <table className="adminorders-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Tên</th>
                        <th>Địa chỉ</th>
                        <th>Sản phẩm</th>
                        <th>Tổng tiền</th>
                        <th>Phương thức</th>
                        <th>Tình trạng</th>
                        <th>Thời gian đặt</th>
                        <th>Xác nhận</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.user.Name}</td>
                            <td>{order.user.name}</td>
                            <td>{order.user.address}</td>
                            <td>
                                <ul>
                                    {order.products.map(product => (
                                        <li key={product._id}>
                                            {product.name} (x{product.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>{order.totalPrice.toLocaleString()} VND</td>
                            <td>{order.method}</td>
                            <td>{order.status}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>
                                {order.status === 'Chưa được xác nhận' && (
                                    <button onClick={() => handleConfirmOrder(order._id)}>Xác nhận</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrderHistory;