import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

function Chat() {
  const navigate = useNavigate();
  const chatSpaceRef = useRef(null);

  const defaultMessages = [
    { id: 1, sender: "Алексей", senderId: "user_alex", text: "Привет, пользователь! Это сообщения для проверки чата.", time: "12:30", isMe: false },
    { id: 2, sender: "Мария", senderId: "user_maria", text: "Всем привет! Кто-нибудь изучал уровень урбанизации в Бишкеке?", time: "12:32", isMe: false },
  ];

  // Восстановление истории из localStorage
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('ub_chat_messages');
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        console.error("Ошибка парсинга истории чата", e);
      }
    }
    return defaultMessages;
  });

  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Сохранение истории в localStorage
  useEffect(() => {
    localStorage.setItem('ub_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Автопрокрутка вниз
  useEffect(() => {
    if (chatSpaceRef.current) {
      chatSpaceRef.current.scrollTop = chatSpaceRef.current.scrollHeight;
    }
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          name: file.name,
          type: file.type,
          url: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() && !selectedFile) return;

    const newMessage = {
      id: Date.now(),
      sender: "Вы",
      senderId: "my_profile",
      text: inputText,
      time: getCurrentTime(),
      isMe: true,
      file: selectedFile 
    };

    setMessages([...messages, newMessage]);
    setInputText("");      
    setSelectedFile(null); 
  };

  const handleUserClick = (senderId) => {
    navigate(`/profile/${senderId}`);
  };

  const clearChatHistory = () => {
    if (window.confirm("Вы уверены, что хотите удалить свои сообщения и сбросить чат?")) {
      setMessages(defaultMessages);
    }
  };

  return (
    <div className='chat-wrapper'>
      <div className='chat-container'>
        
        <div className='chat-head'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <h2>💬 Сообщество UrbanBalance</h2>
              <p>Обсуждение урбанистики и развития городов</p>
            </div>
            {messages.length > 2 && (
              <button onClick={clearChatHistory} className="clear-chat-btn" title="Сбросить чат">
                🗑️
              </button>
            )}
          </div>
        </div>
        
        <div className='chat-space' ref={chatSpaceRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message-block ${msg.isMe ? 'my-msg' : 'other-msg'}`}>
              <div className='msg-bubble'>
                
                {!msg.isMe && (
                  <div className='msg-sender' onClick={() => handleUserClick(msg.senderId)}>
                    {msg.sender}
                  </div>
                )}
                
                {msg.file && (
                  <div className='msg-media-wrapper'>
                    {msg.file.type.startsWith('image/') && (
                      <img src={msg.file.url} alt="img" className="chat-media" />
                    )}
                    {msg.file.type.startsWith('video/') && (
                      <video src={msg.file.url} controls className="chat-media" />
                    )}
                    {!msg.file.type.startsWith('image/') && !msg.file.type.startsWith('video/') && (
                      <a href={msg.file.url} download={msg.file.name} className="chat-file-link">
                        📁 {msg.file.name}
                      </a>
                    )}
                  </div>
                )}

                {msg.text && <div className='msg-text'>{msg.text}</div>}
                <div className='msg-time'>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {selectedFile && (
          <div className="file-preview-bar">
            <span>📎 {selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)}>×</button>
          </div>
        )}
        
        {/* УМНЫЙ ПОДВАЛ ЧАТА С ПРОВЕРКОЙ НАЛИЧИЯ АККАУНТА */}
        {localStorage.getItem('ub_current_user') ? (
          <div className='chat-foot'>
            <label className='file-label' title="Прикрепить фото/видео/файл">
              📎
              <input className='file-input' type="file" onChange={handleFileChange} accept="image/*,video/*,.pdf,.doc,.docx" />
            </label>
            
            <input 
              className='msg-input' 
              type='text' 
              placeholder='Напишите сообщение...' 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            <button className='send-btn' type="button" onClick={handleSendMessage}>
              <span>Отправить</span> 🚀
            </button>
          </div>
        ) : (
          <div className='chat-foot-unauthorized'>
            <p>Чтобы отправлять сообщения в чат, пожалуйста, авторизуйтесь</p>
            <button className='auth-redirect-btn' onClick={() => navigate('/profile')}>
              Войти / Зарегистрироваться 👤
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Chat;