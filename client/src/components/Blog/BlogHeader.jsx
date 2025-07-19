import React from 'react';
import { Link } from 'react-router-dom';
import './styles/blog.css';

const BlogHeader = () => {
    return (
        <header className="blog-header">
            <div className="blog-header-content">
                <h1 className="blog-title">Research Community Blog</h1>
                <nav className="blog-nav">
                    <Link to="/blog">All Posts</Link>
                    <Link to="/blog/create">Create Post</Link>
                    <Link to="/research">Back to Research</Link>
                </nav>
            </div>
        </header>
    );
};

export default BlogHeader;