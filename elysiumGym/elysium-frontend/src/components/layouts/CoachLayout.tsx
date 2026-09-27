import React from 'react';
import { Outlet } from 'react-router-dom';
import CoachSidebar from '../CoachSidebar';

const CoachLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 z-30">
        <CoachSidebar />
      </div>
      
      {/* Main Content with left margin to account for fixed sidebar */}
      <main className="flex-1 ml-64 p-6 md:p-10 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default CoachLayout;
