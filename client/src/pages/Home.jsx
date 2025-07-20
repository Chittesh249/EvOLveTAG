import React, { useRef, useState } from 'react';
import './styles/Home.css';
import { Link } from "react-router-dom";

const members = [
  { name: 'Dr. Ayesha Khan', title: 'Senior Researcher', field: 'AI & ML' },
  { name: 'Prof. Rohan Mehta', title: 'Data Scientist', field: 'Bioinformatics' },
  { name: 'Sahana Roy', title: 'Research Associate', field: 'Cybersecurity' },
  { name: 'Rahul Nair', title: 'Junior Researcher', field: 'Blockchain' },
  { name: 'Tanvi Patel', title: 'PhD Student', field: 'NLP' },
];

const Home = () => {
  const scrollRef = useRef();
  const [email, setEmail] = useState('');

  const scroll = (direction) => {
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}`);
    setEmail('');
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to EvolveTAG</h1>
          <p className="hero-subtitle">Empowering researchers with cutting-edge tools and collaboration</p>
          <div className="hero-buttons">
            <Link to="/papers" className="btn btn-primary">Explore Papers</Link>
            <Link to="/profile" className="btn btn-secondary">My Profile</Link>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="section members-section">
        <div className="section-header">
          <h2>Our Research Team</h2>
          <p className="section-subtitle">Meet our distinguished researchers and collaborators</p>
        </div>
        
        <div className="members-container">
          <button 
            className="arrow-btn left" 
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="members-wrapper" ref={scrollRef}>
            {members.map((member, index) => (
              <div className="member-card" key={index}>
                <div className="member-avatar">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3>{member.name}</h3>
                <p className="member-title">{member.title}</p>
                <p className="member-field">{member.field}</p>
                <button className="member-contact">View Profile</button>
              </div>
            ))}
          </div>

          <button 
            className="arrow-btn right" 
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section newsletter-section">
        <div className="section-header">
          <h2>Stay Updated</h2>
          <p className="section-subtitle">Subscribe to our research newsletter</p>
        </div>
        
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </div>
          <p className="form-note">We respect your privacy. Unsubscribe at any time.</p>
        </form>
      </section>
    </div>
  );
};

export default Home;