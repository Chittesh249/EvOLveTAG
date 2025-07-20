import React, { useEffect, useState } from 'react';
import API from '../api/axios';  
import { FiDownload, FiFileText, FiSearch } from 'react-icons/fi';
import './styles/PaperList.css';

export default function PaperList() {
  const [papers, setPapers] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Add this line
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setIsLoading(true);
        const res = await API.get('/papers');
        setPapers(res.data);
      } catch (err) {
        console.error('Error fetching papers:', err);
        alert('Failed to load papers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPapers();
  }, []);
  const openModal = (url) => {
    setSelectedPDF(url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPDF(null);
  };

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="paper-list-container">
      <div className="paper-list-header">
        <h2>Research Publications</h2>
        <p>Browse our collection of academic papers and research</p>
      </div>

      <div className="filter-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="filter-input"
          placeholder="Search papers by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="empty-state">
          <p>Loading research papers...</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="empty-state">
          <FiFileText size={48} />
          <p>No papers found matching your search</p>
        </div>
      ) : (
        <ul className="paper-list">
          {filteredPapers.map((paper) => (
            <li key={paper.id} className="paper-item">
              <div className="paper-details">
                <h3 className="paper-title">{paper.title}</h3>
                <p className="paper-author">By {paper.author}</p>
              </div>
              <div className="paper-actions">
                <button 
                  className="action-btn"
                  onClick={() => openModal(paper.file_url)}
                >
                  <FiFileText /> View
                </button>
                <a
                  href={paper.file_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="action-btn download"
                >
                  <FiDownload /> Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            {selectedPDF ? (
              <iframe 
                src={selectedPDF} 
                className="pdf-viewer" 
                title="PDF Viewer" 
              />
            ) : (
              <p>PDF not available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

}