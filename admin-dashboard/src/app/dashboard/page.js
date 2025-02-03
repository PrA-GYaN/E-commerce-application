"use client";
import { useState } from 'react';
import Navbar from '../components/navbar';
import Categories from '../components/categories';
import Products from '../components/product';
import Welcome from '../components/welcome';
import { useUser } from '@clerk/nextjs';
import NoAccessPage from '../components/NoAccessPage';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('welcome');
  const { user, isLoaded, isSignedIn } = useUser();
  // const roles = user.publicMetadata.roles || [];
  if (!isSignedIn || !user.publicMetadata.roles?.includes('admin')) {
    return <NoAccessPage />;
  }
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