import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AdminLogin.css'; // Thêm CSS nếu cần

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Kiểm tra đầu vào
        if (!username || !password) {
            setError('Vui lòng điền tên người dùng và mật khẩu');
            return;
        }

        setLoading(true); // Bắt đầu loading

        try {
            const response = await axios.post('http://localhost:5000/api/v1/admin/login', {
                username,
                password,
            });

            // Kiểm tra và ghi log dữ liệu admin
            console.log('Dữ liệu admin:', response.data.admin);
            localStorage.setItem('admin', JSON.stringify(response.data.admin));
            console.log('Dữ liệu đã lưu vào localStorage:', localStorage.getItem('admin'));

            navigate('/admin'); // Chuyển hướng tới trang admin
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message); // Lấy thông điệp lỗi từ server
            } else {
                setError('Lỗi kết nối tới server');
            }
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng nhập</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;