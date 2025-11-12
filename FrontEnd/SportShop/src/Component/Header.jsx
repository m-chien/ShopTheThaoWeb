import { useState } from "react";

export default function Header({ searchTerm, setSearchTerm }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>SportShop</h1>
        </div>
        <nav className="nav-links">
          <a href="#" className="nav-link active">
            All
          </a>
          <a href="#" className="nav-link">
            Shoes
          </a>
          <a href="#" className="nav-link">
            Apparel
          </a>
          <a href="#" className="nav-link">
            Accessories
          </a>
        </nav>
        <div className="header-right">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="cart-btn">🛒</button>
        </div>
      </div>
    </header>
  );
}
