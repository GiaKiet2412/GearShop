import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AdminCategory.css';
import AdminHeader from './AdminHeader';

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState("");
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [confirmAction, setConfirmAction] = useState({ visible: false, action: null, id: null, name: "" });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/categories/');
                setCategories(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleAddCategory = () => {
        if (newCategory.trim() === "") {
            alert("Vui lòng nhập tên loại.");
            return;
        }
        setConfirmAction({ visible: true, action: 'add', name: newCategory });
    };

    const confirmAddCategory = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/v1/categories/', { Type: newCategory });
            setCategories([...categories, res.data]);
            setNewCategory("");
            setConfirmAction({ visible: false, action: null, id: null, name: "" });
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmEditCategory = async () => {
        if (editCategoryName.trim() === "") {
            alert("Vui lòng nhập tên loại.");
            return;
        }
        try {
            // Kiểm tra ID trước khi gửi yêu cầu PUT
            if (!confirmAction.id) {
                alert("ID không hợp lệ.");
                return;
            }
    
            const res = await axios.put(`http://localhost:5000/api/v1/categories/${confirmAction.id}`, { Type: editCategoryName });
            setCategories(categories.map(cat => (cat._id === confirmAction.id ? res.data : cat)));
            setEditCategoryId(null);
            setEditCategoryName("");
            setConfirmAction({ visible: false, action: null, id: null, name: "" });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteCategory = (id) => {
        setConfirmAction({ visible: true, action: 'delete', id });
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/categories/${confirmAction.id}`);
            setCategories(categories.filter(cat => cat._id !== confirmAction.id));
            setConfirmAction({ visible: false, action: null, id: null, name: "" });
        } catch (err) {
            setError(err.message);
        }
    };

    const cancelAction = () => {
        setConfirmAction({ visible: false, action: null, id: null, name: "" });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <AdminHeader />
            <div className="category-list">
                <h2>DANH SÁCH LOẠI SẢN PHẨM</h2>
                <div className="add-category">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Thêm category mới"
                    />
                    <button onClick={handleAddCategory}>Thêm +</button>
                </div>
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Loại sản phẩm</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id} className="category-item">
                                <td>
                                    {/* Hiển thị tên loại sản phẩm hoặc ô input để chỉnh sửa */}
                                    {editCategoryId === category._id ? (
                                        <input
                                            type="text"
                                            value={editCategoryName}
                                            onChange={(e) => setEditCategoryName(e.target.value)}
                                        />
                                    ) : (
                                        <h4>{category.Type}</h4>
                                    )}
                                </td>
                                <td className="button-group">
                                    {/* Hiển thị nút "Lưu" và "Hủy" khi chỉnh sửa, nếu không thì hiển thị "Sửa" và "Xóa" */}
                                    {editCategoryId === category._id ? (
                                        <>
                                            <button
                                                className="save-button"
                                                onClick={confirmEditCategory}
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                className="cancel-button"
                                                onClick={() => {
                                                    setEditCategoryId(null);
                                                    setEditCategoryName('');
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="edit-button"
                                                onClick={() => {
                                                    setEditCategoryId(category._id);
                                                    setEditCategoryName(category.Type);
                                                }}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteCategory(category._id)}
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {confirmAction.visible && (
                <div className="confirm-dialog">
                    <p>Bạn có chắc muốn {confirmAction.action === 'delete' ? 'xóa' : 'thêm'} loại "{confirmAction.name}" không?</p>
                    <button onClick={confirmAction.action === 'delete' ? confirmDelete : confirmAddCategory}>Xác nhận</button>
                    <button onClick={cancelAction}>Hủy</button>
                </div>
            )}
        </div>
    );
};

export default AdminCategory;
