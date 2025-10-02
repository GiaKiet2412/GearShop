import React from 'react';
import '../css/AdminHeader.css'; 

const AdminHeader = ({ onLogout }) => {
    return (
        <header className="admin-header">
            <nav className="linkadminheader">
                <a className="header-link" href="/admin">TRANG CHỦ</a>
                <a className="header-link" href="/admin/admincategory">QUẢN LÝ LOẠI SẢN PHẨM</a>
                <a className="header-link" href="/admin/adminproductlist">QUẢN LÝ SẢN PHẨM</a>
                <a className="header-link" href="/admin/admincustomerlist">QUẢN LÝ TÀI KHOẢN</a>
                <a className="header-link" href="/admin/adminorderhistory">QUẢN LÝ HÓA ĐƠN</a>
                <button onClick={onLogout} className="logout-button">Đăng xuất</button>
            </nav>
        </header>
    );
};

export default AdminHeader;