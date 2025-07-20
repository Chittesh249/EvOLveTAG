import React from 'react';
import { Link } from 'react-router-dom';
import './styles/blog.css';

const PostList = ({ posts }) => {
    // Sample data - in a real app, this would come from props or API
    const samplePosts = [
        {
            id: 1,
            title: 'Advances in Quantum Computing Research',
            author: 'Dr. Emily Chen',
            date: '2023-06-15',
            excerpt: 'Exploring the latest breakthroughs in quantum algorithms and their potential applications in scientific research.',
            tags: ['Quantum', 'Physics', 'Algorithms']
        },
        {
            id: 2,
            title: 'Machine Learning for Materials Science',
            author: 'Prof. James Wilson',
            date: '2023-06-10',
            excerpt: 'How deep learning models are accelerating the discovery of new materials with desired properties.',
            tags: ['ML', 'Materials', 'AI']
        }
    ];

    const displayedPosts = posts || samplePosts;

    return (
        <div className="blog-main">
            {displayedPosts.map(post => (
                <article key={post.id} className="post-card">
                    <h2 className="post-title">
                        <Link to={`/blog/posts/${post.id}`}>{post.title}</Link>
                    </h2>
                    <div className="post-meta">
                        <span>By {post.author}</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-tags">
                        {post.tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                </article>
            ))}
        </div>
    );
};

export default PostList;