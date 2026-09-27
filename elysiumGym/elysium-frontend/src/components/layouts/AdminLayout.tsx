// components/layouts/AdminLayout.jsx
import React from 'react';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Topbar />
        <div className="bg-[#FFFFFF] overflow-auto flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
