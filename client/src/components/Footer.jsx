import React from "react";
import "./Footer.css";

const GITHUB_URL = "https://github.com/vasudevkishor";
const LINKEDIN_URL = "https://linkedin.com/in/vasudevkishor";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-line">
          <span>Maintainer: Vasudev Kishor</span>
          <span className="footer-sep">·</span>
          <span>Roll No.: CB.SC.U4CSE23151</span>
          <span className="footer-sep">·</span>
          <a href="mailto:cb.sc.u4cse23151@cb.students.amrita.edu" className="footer-link">Email</a>
          <span className="footer-sep">·</span>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
          <span className="footer-sep">·</span>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="footer-link">LinkedIn</a>
        </p>
      </div>
    </footer>
  );
}
