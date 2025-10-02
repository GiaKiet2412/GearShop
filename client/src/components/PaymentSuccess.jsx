import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();

    // Lấy số tiền từ query parameter
    const queryParams = new URLSearchParams(location.search);
    const amount = queryParams.get('amount');

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Thanh toán thành công!</h1>
            {amount ? (
                <p>Bạn đã thanh toán số tiền: <strong>{parseInt(amount).toLocaleString('vi-VN')} VNĐ</strong></p>
            ) : (
                <p>Thông tin số tiền không khả dụng.</p>
            )}
            <button
                onClick={() => window.location.href = '/orders'}
                style={{
                    padding: '10px 20px',
                    marginTop: '20px',
                    backgroundColor: '#b40606',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Quay về trang chủ
            </button>
        </div>
    );
};

export default PaymentSuccess;
