// src/components/Header.js
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
    const { cartCount } = useContext(CartContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm) {
            navigate(`/search?query=${encodeURIComponent(trimmedSearchTerm)}`);
        } else {
            alert('Vui lòng nhập từ khóa tìm kiếm!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const handleUserNameClick = () => {
        if (user) {
            navigate('/orders');
        }
    };

    return (
        <header>
            <nav>
                <ul>
                    <div className="header-logo">
                        <a href="/">
                            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/03/logo-the-coffee-house-chieu-dai.png" alt="Logo"/>
                        </a>
                    </div>
                    <form onSubmit={handleSearchSubmit} className="headersearch-form">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button type="submit">Tìm</button>
                    </form>
                    <div className="header-cart">
                        <a href="/cart">
                            <img src="https://img.icons8.com/?size=100&id=ii6Lr4KivOiE&format=png&color=1A1A1A" alt="Cart" />
                            {cartCount > 0 && (
                                <span className="cart-count">{cartCount}</span>
                            )}
                        </a>
                    </div>
                    <div className="header-user">
                        {user ? (
                            <>
                                <span onClick={handleUserNameClick} className="user-name">Xin chào&nbsp;{user.Name}!</span>
                                <div className="user-menu">
                                    <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
                                </div>
                            </>
                        ) : (
                            <a href="/login">
                                <img src="https://img.icons8.com/?size=100&id=85147&format=png&color=1A1A1A" alt="Login" />
                            </a>
                        )}
                    </div>
                </ul>
            </nav>
        </header>
    );
};

export default Header;