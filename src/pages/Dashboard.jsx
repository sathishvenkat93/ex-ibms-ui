// src/pages/Dashboard.jsx
import React from 'react';
import Layout from '@/components/Layout';

export default function Dashboard() {
  return (
    <Layout>
    <div className="p-6 bg-white dark:bg-gray-800 rounded shadow-md w-full">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p>Statistics will be seen here</p>
    </div>
    </Layout>
  );
}
