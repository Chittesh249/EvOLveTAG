import React from 'react';
import { Outlet } from 'react-router-dom';
import BlogSidebar from '../components/Blog/BlogSidebar';
import '../components/Blog/styles/blog.css';

const BlogPage = () => {
  return (
    <div className="blog-container main-content">
      <div className="blog-content">
        <Outlet /> {/* Renders nested routes */}
        <BlogSidebar />
      </div>
    </div>
  );
};

export default BlogPage;