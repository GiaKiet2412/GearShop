import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import '../css/AdminHome.css';

const AdminHome = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('admin'); // Xóa thông tin admin khỏi localStorage
        navigate('/admin/login'); // Chuyển hướng về trang đăng nhập
    };

    return (
        <div>
            <AdminHeader onLogout={handleLogout} />
            <div className="adminhome-content">
                <h1 className="adminhomeh1">TRANG QUẢN TRỊ GEARSHOP</h1>
            </div>
        </div>
    );
};

export default AdminHome;