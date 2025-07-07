import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import './styles/ResearchPapers.css';

export default function ResearchPapers() {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await API.get('/papers');
        setPapers(res.data);
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
              <a href={paper.file_url} target="_blank" rel="noreferrer">
                View / Download PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
