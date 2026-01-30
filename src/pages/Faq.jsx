import React, { useState } from 'react';
import './Faq.css';

function Faq() {
  // Состояние для хранения индекса открытого вопроса
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      q: "Что такое урбанизация?",
      a: "Это рост городов вследствие перемещения населения из сельских районов в поисках лучшей работы и лучших условий для жизни."
    },
    {
      q: "Почему урбанизация это проблема?",
      a: "Опустошение сельской местности, забитые города, инфляция, экологические катастрофы, транспортный коллапс, ухудшение здоровья, стресс, социальные и экономические дисбалансы."
    },
    {
      q: "Почему люди уезжают с сёл и приезжают в город?",
      a: "В поисках лучших условий для жизни, работы и образования. Появляются новые технологии, которыми в сёлах сложно пользоваться ежедневно, а в городах жизнь развивается быстрее."
    },
    {
      q: "Что такое UrbanBalance?",
      a: "Платформа, предназначенная для регулирования быстрого роста населения в городах. Цель — сбалансировать уровень жизни в регионах и мегаполисах."
    },
    {
      q: "Фишки UrbanBalance",
      a: [
        "Выберите город и страну, чтобы получить актуальную информацию об уровне жизни и развитии.",
        "Поиск терминов в нашем справочнике.",
        "Целое комьюнити для обмена опытом и советами.",
        "Активное использование данных проекта в социальной политике."
      ]
    }
  ];

  const toggleQuestion = (index) => {
    // Если нажимаем на уже открытый — закрываем (null), иначе открываем текущий
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className='faq-container'>
      <h1 className="faq-title">Часто задаваемые вопросы</h1>
      <div className='faq-list'>
        {questions.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleQuestion(index)}
          >
            <div className="question-header">
              <p>{item.q}</p>
              <span className="arrow">▼</span>
            </div>
            
            <div className="answer-wrapper">
              <div className='answer-content'>
                {Array.isArray(item.a) ? (
                  <ul>
                    {item.a.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                ) : (
                  <p>{item.a}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faq;