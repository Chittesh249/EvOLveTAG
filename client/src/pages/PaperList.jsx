import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import './styles/PaperList.css';

export default function PaperList() {
  const [papers, setPapers] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const openModal = (url) => {
    setSelectedPDF(url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPDF(null);
    setModalOpen(false);
  };

  return (
    <div className="paper-list-container">
      <h2>Research Papers</h2>
      {papers.length === 0 ? (
        <p>No papers available.</p>
      ) : (
        <ul>
          {papers.map((paper) => (
            <li key={paper.id}>
              <strong>{paper.title}</strong> by {paper.author}
              <div className="paper-actions">
                <button onClick={() => openModal(paper.file_url)}>View</button>
                <a href={paper.file_url} download target="_blank" rel="noreferrer">
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>X</button>
            {selectedPDF ? (
              <iframe src={selectedPDF} title="PDF Viewer" width="100%" height="600px" />
            ) : (
              <p>PDF not found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
