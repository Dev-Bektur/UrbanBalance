import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DetailsPage.css';

function DetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { info } = location.state || {}; // Получаем данные из навигации

  if (!info) {
    return (
      <div className="error-page">
        <h2>Данные не найдены</h2>
        <button onClick={() => navigate('/')}>Вернуться на карту</button>
      </div>
    );
  }

  // Заглушка для данных, которых нет в API Nominatim
  // В реальном приложении здесь был бы fetch к базе данных
  const extraData = {
    population: "1.2 млн",
    urbanLevel: "68%",
    education: "94%",
    unemployment: "5.4%",
    avgSalary: "$600",
    gdp: "$8.5 млрд",
    ecology: "Средний уровень",
    socialLife: "Активно развивающаяся"
  };

  return (
    <div className="details-container">
      <header className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>
        <h1>{info.name}</h1>
        <p className="full-location">{info.fullName}</p>
      </header>

      <div className="details-grid">
        {/* Блок: Общая информация */}
        <section className="info-card">
          <h3>👥 Демография и Социум</h3>
          <ul>
            <li><span>Население:</span> <strong>{extraData.population}</strong></li>
            <li><span>Уровень урбанизации:</span> <strong>{extraData.urbanLevel}</strong></li>
            <li><span>Уровень образования:</span> <strong>{extraData.education}</strong></li>
            <li><span>Соц. жизнь:</span> <strong>{extraData.socialLife}</strong></li>
          </ul>
        </section>

        {/* Блок: Экономика */}
        <section className="info-card highlight">
          <h3>💰 Экономика и Работа</h3>
          <ul>
            <li><span>ВВП:</span> <strong>{extraData.gdp}</strong></li>
            <li><span>Безработица:</span> <strong>{extraData.unemployment}</strong></li>
            <li><span>Средняя зарплата:</span> <strong>{extraData.avgSalary}</strong></li>
            <li><span>Рынок труда:</span> <strong>Растущий</strong></li>
          </ul>
        </section>

        {/* Блок: Экология и Среда */}
        <section className="info-card">
          <h3>🌱 Экология и Инфраструктура</h3>
          <ul>
            <li><span>Состояние воздуха:</span> <strong>{extraData.ecology}</strong></li>
            <li><span>Зеленые зоны:</span> <strong>24% территории</strong></li>
            <li><span>Транспорт:</span> <strong>Развит</strong></li>
          </ul>
        </section>

        {/* Блок: География */}
        <section className="info-card">
          <h3>📍 Географические данные</h3>
          <ul>
            <li><span>Широта:</span> <strong>{info.coordinates[1].toFixed(4)}</strong></li>
            <li><span>Долгота:</span> <strong>{info.coordinates[0].toFixed(4)}</strong></li>
            <li><span>Тип:</span> <strong>{info.type === 'city' ? 'Город' : 'Страна'}</strong></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default DetailsPage;