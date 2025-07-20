import React from 'react';
import { useParams } from 'react-router-dom';
import './styles/blog.css';

const BlogPost = () => {
    const { id } = useParams();
    
    // In a real app, this would come from an API call using the id
    const post = {
        id: 1,
        title: 'Advances in Quantum Computing Research',
        author: 'Dr. Emily Chen',
        date: '2023-06-15',
        content: `
            <h2>Introduction</h2>
            <p>Quantum computing has made significant strides in recent years, with researchers achieving milestones in quantum supremacy and error correction.</p>
            
            <h2>Recent Breakthroughs</h2>
            <p>Our team has developed a new quantum algorithm that significantly reduces the error rates in quantum computations. This breakthrough could pave the way for more practical applications of quantum computing in fields like cryptography and drug discovery.</p>
            
            <p>Key findings include:</p>
            <ul>
                <li>30% reduction in error rates compared to previous methods</li>
                <li>Improved stability in quantum states</li>
                <li>More efficient use of qubits</li>
            </ul>
            
            <h2>Future Directions</h2>
            <p>We're currently exploring applications of this algorithm in materials science simulations, which could dramatically accelerate the discovery of new materials with desired properties.</p>
        `,
        tags: ['Quantum', 'Physics', 'Algorithms']
    };

    return (
        <div className="blog-main">
            <article className="post-card">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-meta">
                    <span>By {post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                
                <div 
                    className="post-content" 
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                <div className="post-tags">
                    {post.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
                
                <div className="post-actions">
                    <button className="action-btn">← Back to Posts</button>
                    <div>
                        <button className="action-btn">Edit</button>
                        <button className="action-btn">Delete</button>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;