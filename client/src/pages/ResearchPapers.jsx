// src/pages/PaperList.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function PaperList() {
  const [papers, setPapers] = useState([]);
  const [viewerUrl, setViewerUrl] = useState(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await API.get('/papers');
        const updated = res.data.map(p => ({
          ...p,
          file_url: `http://localhost:5000${p.file_url}`
        }));
        setPapers(updated);
      } catch (err) {
        console.error('Error fetching papers:', err);
        alert('Failed to load papers');
      }
    };

    fetchPapers();
  }, []);

  return (
    <div className="papers-container">
      <h2>Research Papers</h2>
      {papers.length === 0 ? (
        <p>No papers found.</p>
      ) : (
        <ul>
          {papers.map((paper) => (
            <li key={paper.id}>
              <strong>{paper.title}</strong> by {paper.author}
              <br />
              <button onClick={() => setViewerUrl(paper.file_url)}>View</button>
              &nbsp;
              <a href={paper.file_url} target="_blank" rel="noreferrer">Download</a>
            </li>
          ))}
        </ul>
      )}

      {viewerUrl && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc' }}>
          <button onClick={() => setViewerUrl(null)}>Close</button>
          <iframe
            src={viewerUrl}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: 'none' }}
          />
        </div>
      )}
    </div>
  );
}
