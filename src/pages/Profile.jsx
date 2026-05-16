import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [screen, setScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [authForm, setAuthForm] = useState({ username: '', password: '', email: '', city: '', role: 'Урбанист-любитель' });
  const [editForm, setEditForm] = useState({ username: '', city: '', role: '', bio: '', avatar: '' });

  // Основные состояния для динамических данных
  const [myMessageCount, setMyMessageCount] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);

  // Состояния для форм создания/редактирования с текстовыми полями
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals' | 'points'
  const [proposalInput, setProposalInput] = useState({ id: null, title: '', category: '', description: '' });
  const [pointInput, setPointInput] = useState({ id: null, address: '', issue: '', details: '' });
  const [editItemId, setEditItemId] = useState(null); 

  useEffect(() => {
    const loggedUser = localStorage.getItem('ub_current_user');
    
    // 1. Считаем сообщения в чате
    const savedMessages = localStorage.getItem('ub_chat_messages');
    let msgCount = 0;
    if (savedMessages) {
      try {
        msgCount = JSON.parse(savedMessages).filter(msg => msg.isMe === true).length;
      } catch (e) { console.error(e); }
    }
    setMyMessageCount(msgCount);

    // 2. Загружаем предложения и точки из localStorage
    const savedProposals = localStorage.getItem('ub_user_proposals');
    if (savedProposals) setProposals(JSON.parse(savedProposals));

    const savedPoints = localStorage.getItem('ub_user_points');
    if (savedPoints) setMapPoints(JSON.parse(savedPoints));

    // 3. Логика распределения профилей
    if (id) {
      if (loggedUser && JSON.parse(loggedUser).username === id) {
        const userObj = JSON.parse(loggedUser);
        setCurrentUser(userObj);
        setEditForm(userObj);
        setScreen('cabinet');
      } else {
        const allUsers = JSON.parse(localStorage.getItem('ub_users_db') || '[]');
        const foundUser = allUsers.find(u => u.username === id);
        if (foundUser) {
          setCurrentUser(foundUser);
          setScreen('cabinet');
        } else {
          const bots = {
            user_alex: { username: 'Алексей', city: 'Бишкек', role: 'Эколог / Исследователь', bio: 'Изучаю загрязнение воздуха и хаотичную застройку.', avatar: '', isBot: true },
            user_maria: { username: 'Мария', city: 'Алматы', role: 'Урбанист / Архитектор', bio: 'Пишу статьи про пешеходные зоны и развитие велодорожек.', avatar: '', isBot: true }
          };
          if (bots[id]) {
            setCurrentUser(bots[id]);
            setScreen('cabinet');
          } else {
            alert("Пользователь не найден");
            navigate('/chat');
          }
        }
      }
    } else {
      if (loggedUser) {
        const userObj = JSON.parse(loggedUser);
        setCurrentUser(userObj);
        setEditForm(userObj);
        setScreen('cabinet');
      } else {
        setScreen('login');
      }
    }
  }, [id, navigate]);

  // Синхронизация списков с localStorage при их изменении
  useEffect(() => {
    if (screen === 'cabinet' && !id) { 
      localStorage.setItem('ub_user_proposals', JSON.stringify(proposals));
    }
  }, [proposals, screen, id]);

  useEffect(() => {
    if (screen === 'cabinet' && !id) {
      localStorage.setItem('ub_user_points', JSON.stringify(mapPoints));
    }
  }, [mapPoints, screen, id]);

  const getChatStatus = () => {
    if (currentUser?.isBot) return { text: "Активен 🔥", class: "status-active" };
    if (myMessageCount === 0) return { text: "Неактивен 💤", class: "status-inactive" };
    if (myMessageCount < 3) return { text: "Мало пишет ✍️", class: "status-low" };
    return { text: "Активен 🔥", class: "status-active" };
  };

  // --- ЛОГИКА ПРЕДЛОЖЕНИЙ ---
  const handleSaveProposal = (e) => {
    e.preventDefault();
    if (!proposalInput.title.trim() || !proposalInput.category.trim() || !proposalInput.description.trim()) return;

    if (editItemId) {
      setProposals(proposals.map(p => p.id === editItemId ? { ...p, title: proposalInput.title, category: proposalInput.category, description: proposalInput.description } : p));
      setEditItemId(null);
    } else {
      const newProposal = { id: Date.now(), title: proposalInput.title, category: proposalInput.category, description: proposalInput.description, date: new Date().toLocaleDateString() };
      setProposals([newProposal, ...proposals]);
    }
    setProposalInput({ id: null, title: '', category: '', description: '' });
  };

  const handleEditProposal = (item) => {
    setEditItemId(item.id);
    setProposalInput({ id: item.id, title: item.title, category: item.category, description: item.description });
  };

  const handleDeleteProposal = (itemId) => {
    if (window.confirm("Удалить это предложение?")) {
      setProposals(proposals.filter(p => p.id !== itemId));
    }
  };

  // --- ЛОГИКА ТОЧЕК НА КАРТЕ ---
  const handleSavePoint = (e) => {
    e.preventDefault();
    if (!pointInput.address.trim() || !pointInput.issue.trim() || !pointInput.details.trim()) return;

    if (editItemId) {
      setMapPoints(mapPoints.map(p => p.id === editItemId ? { ...p, address: pointInput.address, issue: pointInput.issue, details: pointInput.details } : p));
      setEditItemId(null);
    } else {
      const newPoint = { id: Date.now(), address: pointInput.address, issue: pointInput.issue, details: pointInput.details, date: new Date().toLocaleDateString() };
      setMapPoints([newPoint, ...mapPoints]);
    }
    setPointInput({ id: null, address: '', issue: '', details: '' });
  };

  const handleEditPoint = (item) => {
    setEditItemId(item.id);
    setPointInput({ id: item.id, address: item.address, issue: item.issue, details: item.details });
  };

  const handleDeletePoint = (itemId) => {
    if (window.confirm("Удалить эту метку?")) {
      setMapPoints(mapPoints.filter(p => p.id !== itemId));
    }
  };

  // Обработчики авторизации
  const handleRegister = (e) => {
    e.preventDefault();
    if (!authForm.username || !authForm.password || !authForm.email) return;
    const allUsers = JSON.parse(localStorage.getItem('ub_users_db') || '[]');
    if (allUsers.some(u => u.username.toLowerCase() === authForm.username.toLowerCase())) { alert("Ник занят"); return; }

    const newUser = { username: authForm.username, email: authForm.email, password: authForm.password, city: authForm.city || 'Не указан', role: authForm.role, bio: 'Расскажите о себе...', avatar: '' };
    allUsers.push(newUser);
    localStorage.setItem('ub_users_db', JSON.stringify(allUsers));
    localStorage.setItem('ub_current_user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    setEditForm(newUser);
    setScreen('cabinet');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const allUsers = JSON.parse(localStorage.getItem('ub_users_db') || '[]');
    const foundUser = allUsers.find(u => u.username === authForm.username && u.password === authForm.password);
    if (foundUser) {
      localStorage.setItem('ub_current_user', JSON.stringify(foundUser));
      setCurrentUser(foundUser);
      setEditForm(foundUser);
      setScreen('cabinet');
    } else { alert("Неверные данные"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('ub_current_user');
    setCurrentUser(null);
    setScreen('login');
    navigate('/profile');
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...currentUser, ...editForm };
    localStorage.setItem('ub_current_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditForm({ ...editForm, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  if (screen === 'login') {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Вход в UrbanBalance</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Никнейм" required value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})} />
            <input type="password" placeholder="Пароль" required value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
            <button type="submit" className="auth-btn">Войти</button>
          </form>
          <p className="auth-toggle">Впервые у нас? <span onClick={() => setScreen('register')}>Создать аккаунт</span></p>
        </div>
      </div>
    );
  }

  if (screen === 'register') {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Регистрация</h2>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Никнейм" required value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})} />
            <input type="email" placeholder="E-mail" required value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
            <input type="password" placeholder="Пароль" required value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
            <input type="text" placeholder="Ваш город" value={authForm.city} onChange={e => setAuthForm({...authForm, city: e.target.value})} />
            <select value={authForm.role} onChange={e => setAuthForm({...authForm, role: e.target.value})}>
              <option value="Урбанист-любитель">Урбанист-любитель</option>
              <option value="Эколог / Активист">Эколог / Активист</option>
              <option value="Инженер / Архитектор">Инженер / Архитектор</option>
            </select>
            <button type="submit" className="auth-btn">Зарегистрироваться</button>
          </form>
          <p className="auth-toggle">Есть аккаунт? <span onClick={() => setScreen('login')}>Войти</span></p>
        </div>
      </div>
    );
  }

  const isLocalStorageMe = localStorage.getItem('ub_current_user');
  const isMyOwnCabinet = !id || (isLocalStorageMe && JSON.parse(isLocalStorageMe).username === currentUser.username);
  const chatStatus = getChatStatus();

  return (
    <div className='profile-wrapper'>
      <div className='profile-container'>
        
        {/* САЙДБАР */}
        <div className='profile-sidebar'>
          <div className='avatar-block'>
            {isEditing ? (
              <label className="avatar-upload">
                <img src={editForm.avatar || 'https://via.placeholder.com/150'} alt="Avatar" />
                <div className="upload-overlay">Сменить фото</div>
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{display: 'none'}} />
              </label>
            ) : (
              <img src={currentUser.avatar || 'https://via.placeholder.com/150'} alt="Avatar" className="user-avatar" />
            )}
          </div>
          <h2 className="user-title">@{currentUser.username}</h2>
          <span className="user-badge">{isEditing ? editForm.role : currentUser.role}</span>
          
          {isMyOwnCabinet && (
            <div className="sidebar-actions">
              {isEditing ? (
                <><button className="save-btn" onClick={handleSaveProfile}>Сохранить</button><button className="cancel-btn" onClick={() => setIsEditing(false)}>Отмена</button></>
              ) : (
                <><button className="edit-btn" onClick={() => setIsEditing(true)}>Редактировать</button><button className="logout-btn" onClick={handleLogout}>Выйти</button></>
              )}
            </div>
          )}
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className='profile-main'>
          <div className="info-section">
            <h3>📍 География: <span style={{fontWeight: '500', color: '#1a202c'}}>{currentUser.city}</span></h3>
            <p className="bio-text" style={{marginTop: '10px'}}>{currentUser.bio}</p>
          </div>

          {/* СТАТИСТИКА */}
          <div className="info-section">
            <h3>📊 Вклад в сообщество UrbanBalance</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-num">💡 {currentUser.isBot ? 3 : proposals.length}</span>
                <span className="stat-label">Предложений по улучшению</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">📌 {currentUser.isBot ? 1 : mapPoints.length}</span>
                <span className="stat-label">Отмеченных точек на карте</span>
              </div>
              <div className="stat-card">
                <span className={`stat-num ${chatStatus.class}`}>{chatStatus.text}</span>
                <span className="stat-label">Статус в чате</span>
              </div>
            </div>
          </div>

          {/* ИНТЕРАКТИВНЫЕ ВКЛАДКИ */}
          {isMyOwnCabinet && (
            <div className="info-section workspace-section">
              <div className="tab-headers">
                <button className={`tab-link ${activeTab === 'proposals' ? 'active' : ''}`} onClick={() => { setActiveTab('proposals'); setEditItemId(null); }}>💡 Мои предложения</button>
                <button className={`tab-link ${activeTab === 'points' ? 'active' : ''}`} onClick={() => { setActiveTab('points'); setEditItemId(null); }}>📌 Мои точки на карте</button>
              </div>

              {/* РАБОЧАЯ ЗОНА: ПРЕДЛОЖЕНИЯ */}
              {activeTab === 'proposals' && (
                <div className="tab-content">
                  <form onSubmit={handleSaveProposal} className="workspace-form">
                    <h4>{editItemId ? "✏️ Редактировать идею" : "➕ Предложить новую идею"}</h4>
                    <input type="text" placeholder="Название идеи (например: Озеленение аллеи)" required value={proposalInput.title} onChange={e => setProposalInput({...proposalInput, title: e.target.value})} />
                    <input type="text" placeholder="Категория (например: Экология, Транспорт, Спорт)" required value={proposalInput.category} onChange={e => setProposalInput({...proposalInput, category: e.target.value})} />
                    <textarea placeholder="Опишите ваше предложение подробно..." rows="3" required value={proposalInput.description} onChange={e => setProposalInput({...proposalInput, description: e.target.value})}></textarea>
                    <button type="submit" className="action-submit-btn">{editItemId ? "Обновить" : "Опубликовать идею"}</button>
                  </form>

                  <div className="items-list">
                    {proposals.map(item => (
                      <div key={item.id} className="workspace-item-card">
                        <div className="item-card-header">
                          <h5>{item.title} <span className="item-badge">{item.category}</span></h5>
                          <span className="item-date">{item.date}</span>
                        </div>
                        <p>{item.description}</p>
                        <div className="item-card-footer">
                          <button onClick={() => handleEditProposal(item)} className="btn-mini-edit">Редактировать</button>
                          <button onClick={() => handleDeleteProposal(item.id)} className="btn-mini-delete">Удалить</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* РАБОЧАЯ ЗОНА: ТОЧКИ */}
              {activeTab === 'points' && (
                <div className="tab-content">
                  <form onSubmit={handleSavePoint} className="workspace-form">
                    <h4>{editItemId ? "✏️ Изменить метку проблемы" : "➕ Отметить проблему на карте"}</h4>
                    <input type="text" placeholder="Адрес / Координаты (например: ул. Киевская 12)" required value={pointInput.address} onChange={e => setPointInput({...pointInput, address: e.target.value})} />
                    <input type="text" placeholder="Тип проблемы (например: Вырубка леса, Разбитый асфальт, Открытый люк)" required value={pointInput.issue} onChange={e => setPointInput({...pointInput, issue: e.target.value})} />
                    <textarea placeholder="Опишите детали проблемы..." rows="3" required value={pointInput.details} onChange={e => setPointInput({...pointInput, details: e.target.value})}></textarea>
                    <button type="submit" className="action-submit-btn btn-point">{editItemId ? "Обновить точку" : "Поставить точку на карту"}</button>
                  </form>

                  <div className="items-list">
                    {mapPoints.map(item => (
                      <div key={item.id} className="workspace-item-card point-card">
                        <div className="item-card-header">
                          <h5>📍 {item.address} <span className="item-badge red-badge">{item.issue}</span></h5>
                          <span className="item-date">{item.date}</span>
                        </div>
                        <p>{item.details}</p>
                        <div className="item-card-footer">
                          <button onClick={() => handleEditPoint(item)} className="btn-mini-edit">Редактировать</button>
                          <button onClick={() => handleDeletePoint(item.id)} className="btn-mini-delete">Удалить</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;