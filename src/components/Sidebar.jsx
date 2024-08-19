import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function DashboardLayout({ children }) {
  const [subMenuOpen, setSubMenuOpen] = useState(true); // Set initial state to true

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4">
          <Link to="/dashboard" className="text-2xl font-bold text-white">Sera - IBMS</Link>
        </div>
        <nav className="flex-grow">
          <ul>
            <li>
             
              <Link to="/dashboard" className="block p-4 hover:bg-gray-700"> <DashboardIcon/> Dashboard</Link>
            </li>
            <li>
              <button onClick={toggleSubMenu} className="block p-4 hover:bg-gray-700 w-full text-left focus:outline-none relative">
                <InventoryIcon/> Inventory
                <svg className={`h-5 w-5 inline-block ml-2 ${subMenuOpen ? 'transform rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {subMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  )}
                </svg>
              </button>
              <ul className={`ml-4 ${subMenuOpen ? '' : 'hidden'}`}>
                <li>
                  <Link to="/inventory" className="block p-2 hover:bg-gray-700"><PrecisionManufacturingIcon/> Products</Link>
                </li>
                <li>
                  <Link to="/stocks" className="block p-2 hover:bg-gray-700"><BuildCircleIcon/> Stock Units</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/billing" className="block p-4 hover:bg-gray-700"><ReceiptIcon/> Billing</Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <ThemeToggle />
        </div>
      </aside>
      <main className="flex-1 bg-gray-100 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}
