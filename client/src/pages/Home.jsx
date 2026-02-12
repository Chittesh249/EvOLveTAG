import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { siteApi } from "../api/services";
import "./styles/Page.css";
import "./styles/Home.css";

const DEFAULT_HERO_TITLE = "Welcome to Evolve TAG";
const DEFAULT_HERO_SUBTITLE = "Empowering researchers with cutting-edge tools and collaboration.";

export default function Home() {
  const [site, setSite] = useState({});

  useEffect(() => {
    siteApi
      .get()
      .then((res) => {
        if (res.success && res.data) setSite(res.data);
      })
      .catch(() => { });
  }, []);

  const heroTitle = site.hero_title || DEFAULT_HERO_TITLE;
  const heroSubtitle = site.hero_subtitle || DEFAULT_HERO_SUBTITLE;

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">{heroTitle}</h1>
          <p className="hero-subtitle">{heroSubtitle}</p>
          <div className="hero-actions">
            <Link to="/papers" className="btn btn-primary">
              Explore papers
            </Link>
            <Link to="/members" className="btn btn-outline">
              Meet the team
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">What we do</h2>
          <p className="section-text">
            Evolve TAG is a research community platform. Browse our publications, meet our members,
            and stay updated with our newsletters.
          </p>
          <div className="quick-links">
            <Link to="/papers" className="quick-link card">
              <span className="quick-link-title">Research papers</span>
              <span className="quick-link-desc">Browse and download publications</span>
            </Link>
            <Link to="/newsletters" className="quick-link card">
              <span className="quick-link-title">Newsletters</span>
              <span className="quick-link-desc">Latest updates and insights</span>
            </Link>
            <Link to="/members" className="quick-link card">
              <span className="quick-link-title">Members</span>
              <span className="quick-link-desc">Our research team</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
