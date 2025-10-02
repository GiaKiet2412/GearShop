import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AdminProductList.css';
import AdminHeader from './AdminHeader';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({
        Name: '',
        Description: '',
        Price: '',
        Img: '',
        Type: '',
        Brand: '',
        Stock: 50,
    });
    const [editProductId, setEditProductId] = useState(null);
    const [confirmAction, setConfirmAction] = useState({ visible: false, action: null, id: null });
    const [message, setMessage] = useState('');
    const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/products');
                setProducts(res.data);
            } catch (err) {
                setError(`Không thể tải danh sách sản phẩm: ${err.response ? err.response.data.message : err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        setIsAddingOrEditing(true);
        setNewProduct({ Name: '', Description: '', Price: '', Img: '', Type: '', Brand: '', Stock: 50 });
    };

    const handleEditProduct = (product) => {
        setIsAddingOrEditing(true);
        setEditProductId(product._id);
        setNewProduct(product);
    };

    const confirmAddProduct = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/v1/products', {
                ...newProduct,
                Price: Number(newProduct.Price),
                Stock: Number(newProduct.Stock),
            });
            setProducts([...products, res.data]);
            setMessage('Thêm sản phẩm thành công!');
            resetForm();
        } catch (err) {
            setError(`Lỗi khi thêm sản phẩm: ${err.response ? err.response.data.message : err.message}`);
        }
    };

    const confirmEditProduct = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/v1/products/${editProductId}`, newProduct);
            setProducts(products.map(prod => (prod._id === editProductId ? res.data : prod)));
            setMessage('Sửa sản phẩm thành công!');
            resetForm();
        } catch (err) {
            setError(`Lỗi khi sửa sản phẩm: ${err.response ? err.response.data.message : err.message}`);
        }
    };

    const handleDeleteProduct = (id) => {
        setConfirmAction({ visible: true, action: 'delete', id });
    };

    const confirmDeleteProduct = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/products/${confirmAction.id}`);
            setProducts(products.filter(prod => prod._id !== confirmAction.id));
            setMessage('Xóa sản phẩm thành công!');
            setConfirmAction({ visible: false, action: null, id: null });
        } catch (err) {
            setError(`Lỗi khi xóa sản phẩm: ${err.response ? err.response.data.message : err.message}`);
        }
    };

    const cancelAction = () => {
        setConfirmAction({ visible: false, action: null, id: null });
    };

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const cancelEdit = () => {
        resetForm();
    };

    const resetForm = () => {
        setEditProductId(null);
        setNewProduct({ Name: '', Description: '', Price: '', Img: '', Type: '', Brand: '', Stock: 50 });
        setIsAddingOrEditing(false);
        setConfirmAction({ visible: false, action: null, id: null });
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const totalPages = Math.ceil(products.length / productsPerPage);
    
    return (
        <div>
            <AdminHeader />
            <div className="product-list">
                {message && <div className="alert">{message}</div>}
                <h2>DANH SÁCH SẢN PHẨM</h2>
                <button onClick={handleAddProduct}>Thêm sản phẩm</button>
                {isAddingOrEditing && (
                    <div className="add-product">
                        <input
                            type="text"
                            name="Name"
                            value={newProduct.Name}
                            onChange={handleInputChange}
                            placeholder="Tên sản phẩm"
                        />
                        <input
                            type="text"
                            name="Description"
                            value={newProduct.Description}
                            onChange={handleInputChange}
                            placeholder="Mô tả"
                        />
                        <input
                            type="text"
                            name="Price"
                            value={newProduct.Price}
                            onChange={handleInputChange}
                            placeholder="Giá"
                        />
                        <input
                            type="text"
                            name="Img"
                            value={newProduct.Img}
                            onChange={handleInputChange}
                            placeholder="Đường dẫn hình ảnh"
                        />
                        <input
                            type="text"
                            name="Type"
                            value={newProduct.Type}
                            onChange={handleInputChange}
                            placeholder="Loại"
                        />
                        <input
                            type="text"
                            name="Brand"
                            value={newProduct.Brand}
                            onChange={handleInputChange}
                            placeholder="Thương hiệu"
                        />
                        <p>Số lượng</p>
                        <input
                            type="number"
                            name="Stock"
                            value={newProduct.Stock}
                            onChange={handleInputChange}
                            placeholder="Tồn"
                        />
                        <button onClick={() => {
                            if (editProductId) {
                                setConfirmAction({ visible: true, action: 'confirmEdit' });
                            } else {
                                setConfirmAction({ visible: true, action: 'confirmAdd' });
                            }
                        }}>
                            {editProductId ? 'Cập nhật' : 'Thêm'}
                        </button>
                        {editProductId && <button className="cancleb" onClick={cancelEdit}>Hủy</button>}
                    </div>
                )}
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Tên sản phẩm</th>
                            <th>Mô tả</th>
                            <th>Giá</th>
                            <th>Hình ảnh</th>
                            <th>Tồn</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map(product => (
                            <tr key={product._id}>
                                <td>{product.Name}</td>
                                <td>{product.Description}</td>
                                <td>{product.Price}đ</td>
                                <td>
                                    <img src={`${process.env.PUBLIC_URL}/${product.Img}`} alt={product.Name} className="product-image" />
                                </td>
                                <td>{product.Stock}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(product)}>Sửa</button>
                                    <button onClick={() => handleDeleteProduct(product._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {confirmAction.visible && (
                    <div className="confirm-dialog">
                        {confirmAction.action === 'delete' && <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>}
                        {confirmAction.action === 'confirmAdd' && <p>Bạn có chắc chắn muốn thêm sản phẩm "{newProduct.Name}" không?</p>}
                        {confirmAction.action === 'confirmEdit' && <p>Bạn có chắc chắn muốn sửa sản phẩm thành "{newProduct.Name}" không?</p>}
                        <button onClick={confirmAction.action === 'delete' ? confirmDeleteProduct : confirmAction.action === 'confirmAdd' ? confirmAddProduct : confirmEditProduct}>
                            Có
                        </button>
                        <button onClick={cancelAction}>Không</button>
                    </div>
                )}
                <div className="pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductList;