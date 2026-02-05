import React, { useState } from 'react';
import './Dictionary.css';

function Dictionary() {
  const [searchTerm, setSearchTerm] = useState("");

  const terms = [
    { word: "Урбанизация", definition: "Рост городов и увеличение количества людей, живущих в них." },
    { word: "Инфраструктура", definition: "Комплекс систем (дороги, связь, больницы), необходимых для жизни города." },
    { word: "ВВП", definition: "Рыночная стоимость всех услуг и товаров, произведенных в стране за год." },
    { word: "Безработица", definition: "Процент людей, которые могут и хотят работать, но не могут найти место." },
    { word: "ИЧР", definition: "Индекс, который показывает качество жизни, грамотность и долголетие людей." },
    { word: "Миграция", definition: "Переезд людей из одного места в другое (например, из села в столицу)." },
    { word: "Мегаполис", definition: "Очень крупный город с населением более миллиона человек." },
    { word: "Промышленность", definition: "Предприятия и заводы, которые перерабатывают сырье в готовую продукцию." },
    { word: "Экология", definition: "Наука о взаимодействии живых организмов и окружающей их среды." },
    { word: "Инфляция", definition: "Процесс повышения общего уровня цен на товары и услуги." },
    { word: "Уровень жизни", definition: "Степень удовлетворения материальных и духовных потребностей людей." },
    { word: "Транспортный коллапс", definition: "Состояние, когда дорожная сеть не справляется с потоком машин (пробки)." },
    { word: "Устойчивое развитие", definition: "Развитие города так, чтобы не портить природу для будущих поколений." }
  ];

  const filteredTerms = terms.filter(item =>
    item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dict-wrapper">
      <div className="dict-container">
        <h1>Справочник UrbanBalance</h1>
        
        <input 
          type="text" 
          placeholder="Поиск по терминам..." 
          className="dict-search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="dict-table">
          <thead>
            <tr>
              <th>Термин</th>
              <th>Объяснение</th>
            </tr>
          </thead>
          <tbody>
            {filteredTerms.length > 0 ? (
              filteredTerms.map((item, index) => (
                <tr key={index}>
                  <td className="term-name">{item.word}</td>
                  <td>{item.definition}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dictionary;