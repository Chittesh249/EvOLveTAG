import React from "react";
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import './Layout.css'; // Create this new CSS file

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet /> 
      </main>
    </>
  );
};

export default Layout;