import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/BestSeller.css'; // Tạo file CSS riêng nếu cần

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/products/best-sellers');
                console.log("Dữ liệu sản phẩm bán chạy:", res.data); // Log dữ liệu trả về
                setBestSellers(res.data.bestSellers);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi lấy sản phẩm bán chạy:", err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data.message : err.message);
                setLoading(false);
            }
        };
    
        fetchBestSellers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Sản phẩm bán chạy</h2>
            <div className="best-seller-list">
                {bestSellers.map(product => (
                    <div key={product._id} className="best-seller-item">
                        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                            <img src={`${process.env.PUBLIC_URL}/${product.Img}`} alt={product.Name} />
                            <h4>{product.Name}</h4>
                            <p>{formatPrice(product.Price)}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
};

export default BestSeller;