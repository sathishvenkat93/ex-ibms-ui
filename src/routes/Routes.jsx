import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Home from '@/pages/Home';
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard';
import Inventory from '@/pages/products/Inventory';
import CreateProductInventory from '@/pages/products/InventoryCreate';
import Billing from '@/pages/billing/Billing';
import Stocks from '@/pages/stocks/Stocks';
import SKUCreateForm from '@/pages/stocks/SKUCreate';
import SKUEditForm from '@/pages/stocks/SKUEditForm';
import InventoryUpdate from '@/pages/products/InventoryUpdate';
import BillingCreate from '@/pages/billing/BillingCreate';


export default function RoutesComponent() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Login/>} />
        <Route exact path='/register' element={<Register/>} />
        <Route exact path='/dashboard' element={<Dashboard/>} />
        <Route exact path='/inventory' element={<Inventory/>} />
        <Route exact path='/inventory/product/create' element={<CreateProductInventory/>} />
        <Route exact path='/inventory/product/update/:productId' element={<InventoryUpdate/>} />
        <Route exact path='/stocks' element={<Stocks/>} />
        <Route exact path='/stocks/create' element={<SKUCreateForm/>} />
        <Route exact path='/stocks/edit/:skuId' element={<SKUEditForm/>} />
        <Route exact path='/billing' element={<Billing/>} />
        <Route exact path='/billing/create' element={<BillingCreate/>} />
      </Routes>
    </Router>
  );
}