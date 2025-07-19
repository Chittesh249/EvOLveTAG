import React from 'react';
import './styles/blog.css';

const BlogSidebar = () => {
    return (
        <aside className="blog-sidebar">
            <div className="sidebar-card">
                <h3 className="sidebar-title">About the Blog</h3>
                <p>This is the research community blog where members can share insights, discoveries, and discussions related to ongoing research projects.</p>
            </div>
            
            <div className="sidebar-card">
                <h3 className="sidebar-title">Categories</h3>
                <ul>
                    <li><a href="#">Quantum Computing</a></li>
                    <li><a href="#">Materials Science</a></li>
                    <li><a href="#">Machine Learning</a></li>
                    <li><a href="#">Data Analysis</a></li>
                </ul>
            </div>
            
            <div className="sidebar-card">
                <h3 className="sidebar-title">Recent Posts</h3>
                <ul>
                    <li><a href="#">Advances in Quantum Research</a></li>
                    <li><a href="#">ML for Materials Discovery</a></li>
                    <li><a href="#">New Data Visualization Tools</a></li>
                </ul>
            </div>
        </aside>
    );
};

export default BlogSidebar;