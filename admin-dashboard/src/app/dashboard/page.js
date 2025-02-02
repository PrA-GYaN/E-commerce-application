"use client";
import { useState } from 'react';
import Navbar from '../components/navbar';
import Categories from '../components/categories';
import Products from '../components/product';
import Welcome from '../components/welcome';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('welcome');

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div>
      <Navbar onPageChange={handlePageChange}/>
      <div className="p-8">
        
        {activePage === 'welcome' && <Welcome />}
        {activePage === 'categories' && <Categories />}
        {activePage === 'products' && <Products/>}
      </div>
    </div>
  );
}