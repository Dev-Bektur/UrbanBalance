import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/image/logo.png';

function Header({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <header className='header'>
      <div className='header-container'>
      <div className='header-left'>
        <img src={logo} alt="logo" />
        <h3>UrbanBalance</h3>
      </div>
      
      <nav>
        <Link to="/">Карта</Link>
        <Link to="/faq">Вопрос-ответ</Link>
        <Link to="/profile">Личный кабинет</Link>
      </nav>

      <div className='header-right'>
        <form className="search" onSubmit={handleSearch}>
          <input 
            type="search" 
            placeholder="Поиск страны..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className='submit' type="submit">Найти</button>
        </form>
        
        <div className='vocab'>
          <button>Справочник</button>
        </div>
      </div>
      </div>
    </header>
  );
}

export default Header;