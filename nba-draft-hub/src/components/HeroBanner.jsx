import React from 'react';
import './HeroBanner.css';

function HeroBanner() {
  return (
    <header className="hero-banner">
      <div className="hero-content">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/9/97/Dallas_Mavericks_logo.svg/1200px-Dallas_Mavericks_logo.svg.png"
          alt="Dallas Mavericks Logo"
          className="hero-logo"
        />
        <div>
          <h1>Dallas Mavericks Draft Hub</h1>
          <p className="hero-subtitle">Scouting, Rankings & Player Intelligence</p>
        </div>
      </div>
    </header>
  );
}

export default HeroBanner;
