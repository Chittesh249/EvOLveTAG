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
                    <li><button type="button" className="link-like">Quantum Computing</button></li>
                    <li><button type="button" className="link-like">Materials Science</button></li>
                    <li><button type="button" className="link-like">Machine Learning</button></li>
                    <li><button type="button" className="link-like">Data Analysis</button></li>
                </ul>
            </div>

            <div className="sidebar-card">
                <h3 className="sidebar-title">Recent Posts</h3>
                <ul>
                    <li><button type="button" className="link-like">Advances in Quantum Research</button></li>
                    <li><button type="button" className="link-like">ML for Materials Discovery</button></li>
                    <li><button type="button" className="link-like">New Data Visualization Tools</button></li>
                </ul>
            </div>
        </aside>
    );
};

export default BlogSidebar;