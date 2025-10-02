import React from 'react';
import Header from './Header';
import Menu from './Menu';
import Slideshow from './Slideshow';
import '../css/Home.css';
import ProductList from './ProductList';
import BestSeller from '../components/BestSeller';
import Footer from './Footer';

const Home = () => {
    return (
        <div>
            <Header />
            <Menu />
            <Slideshow />
            <h1 className="home-h1">SẢN PHẨM</h1>

            <ProductList />
            <Footer />
        </div>
    );
};

export default Home;