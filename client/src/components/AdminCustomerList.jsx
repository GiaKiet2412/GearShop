import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import '../css/AdminCustomerList.css'; 

const AdminCustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/customers');
                setCustomers(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) return <div className="admincustomers-loading">Loading...</div>;
    if (error) return <div className="admincustomers-error">Error: {error}</div>;

    return (
        <div className="admincustomers-container">
            <AdminHeader />
            <h1 className="admincustomers-title">DANH SÁCH NGƯỜI DÙNG</h1>
            <table className="admincustomers-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Địa chỉ</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer._id}>
                            <td>{customer._id}</td>
                            <td>{customer.Name}</td>
                            <td>{customer.Email}</td>
                            <td>{customer.Phone}</td>
                            <td>{customer.Address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCustomerList;