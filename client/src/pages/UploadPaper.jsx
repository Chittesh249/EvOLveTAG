import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './styles/UploadPaper.css';

export default function UploadPaper() {
  const [form, setForm] = useState({ title: '', author: '' });
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (!jwt) {
      alert('You must be logged in to upload a paper.');
      window.location.href = '/login';
    } else {
      setToken(jwt);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('author', form.author);
    formData.append('file', file);

    try {
      await API.post('/papers', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Paper uploaded successfully!');
      setForm({ title: '', author: '' });
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.msg || 'Upload failed');
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Research Paper</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paper Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author Name"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
