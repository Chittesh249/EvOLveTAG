import React, { useState } from 'react';
import './styles/blog.css';

const CreatePost = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim())
        });
        setFormData({
            title: '',
            content: '',
            tags: ''
        });
    };

    return (
        <div className="blog-main">
            <form className="create-post-form" onSubmit={handleSubmit}>
                <h2>Create New Post</h2>
                
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="tags">Tags (comma separated)</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                    />
                </div>
                
                <button type="submit" className="submit-btn">Publish Post</button>
            </form>
        </div>
    );
};

export default CreatePost;