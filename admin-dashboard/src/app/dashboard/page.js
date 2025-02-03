"use client";
import { useState } from 'react';
import Navbar from '../components/navbar';
import Categories from '../components/categories';
import Products from '../components/product';
import Welcome from '../components/welcome';
import { useUser } from '@clerk/nextjs';
import NoAccessPage from '../components/NoAccessPage';
import Login from '../login/Login';
import { Analytics } from '../components/analytics';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('welcome');
  const { user, isLoaded, isSignedIn } = useUser();
  // const roles = user.publicMetadata.roles || [];
  if (!isLoaded) {
    return null;
  }
  if (!isSignedIn) {
    return <Login />;
  }
  if (!user.publicMetadata.roles?.includes('admin')) {
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
        {activePage === 'analytics' && <Analytics />}
      </div>
    </div>
  );
}