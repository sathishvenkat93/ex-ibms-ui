import React from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex justify-end">
          {/* <ThemeToggle /> */}
        </div>
        {children}
      </div>
    </div>
  );
}
