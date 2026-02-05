import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DetailsPage.css';

function DetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { info } = location.state || {};

  if (!info) {
    return (
      <div className="error-container">
        <h2>Упс! Данные не найдены</h2>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    );
  }

  // Пример данных для города/страны
  const stats = [
    { label: "Население", value: "1.2M", icon: "👥", color: "#4A90E2" },
    { label: "Урбанизация", value: "68%", icon: "🏙", color: "#eca406" },
    { label: "Безработица", value: "5.4%", icon: "💼", color: "#ef4444" },
    { label: "Зарплата (ср)", value: "$620", icon: "💵", color: "#10b981" },
  ];

  return (
    <div className="details-page">
      <div className="details-wrapper">
        <button className="back-link" onClick={() => navigate(-1)}>← Назад к карте</button>
        
        <header className="details-main-info">
          <h1>{info.name}</h1>
          <span className="badge">{info.type === 'city' ? 'Город' : 'Страна'}</span>
          <p className="coords">{info.coordinates[1].toFixed(3)}° N, {info.coordinates[0].toFixed(3)}° E</p>
        </header>

        <div className="stats-grid">
          {stats.map((item, idx) => (
            <div key={idx} className="stat-box" style={{ borderBottom: `4px solid ${item.color}` }}>
              <span className="stat-icon">{item.icon}</span>
              <div className="stat-info">
                <p className="stat-label">{item.label}</p>
                <p className="stat-value">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="content-sections">
          <section className="detail-section">
            <h3>📈 Экономический профиль</h3>
            <p>Экономика региона базируется на сфере услуг и легкой промышленности. Уровень ИЧР (индекс человеческого развития) оценивается как высокий. Наблюдается стабильный приток инвестиций в технологический сектор.</p>
          </section>

          <section className="detail-section">
            <h3>🌳 Экология и среда</h3>
            <p>Индекс качества воздуха (AQI): 45 (Хорошо). В городе реализуется программа UrbanBalance по расширению зеленых зон и снижению углеродного следа от общественного транспорта.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;