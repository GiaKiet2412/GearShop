import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import '../css/ProductList.css';
import Header from './Header';
import Menu from './Menu';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    const query = new URLSearchParams(useLocation().search).get('query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/products/search?query=${query}`);
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query]);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Header />
            <Menu />
            <div className="pl-product-list">
                <h2>Kết quả tìm kiếm cho: "{query}"</h2>
                <ul>
                    {currentProducts.length > 0 ? (
                        currentProducts.map(product => (
                            <li key={product._id} className="pl-product-list-item">
                                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                    <img src={`${process.env.PUBLIC_URL}/${product.Img}`} alt={product.Name} />
                                    <h4 className="product-name">{product.Name}</h4>
                                </Link>
                                <div className="pl-priceandbutton">
                                    <div className="priceproduct">{formatPrice(product.Price)}</div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div>Không tìm thấy sản phẩm nào.</div>
                    )}
                </ul>
                <div className="pl-pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button 
                            key={index + 1} 
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
