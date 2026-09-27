import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 text-white grid place-items-center font-bold shadow-sm">TF</div>
            <span className="text-lg font-semibold tracking-tight text-slate-800">TaskFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `transition-colors hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-slate-600'}`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) => `transition-colors hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-slate-600'}`}
            >
              Tasks
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
