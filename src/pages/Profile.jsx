import React from 'react'
import './Profile.css'

function Profile() {
  return (
    <div className='profilePage'>
      <div className='profileLeft'>
        <div>
          <h2>Имя пользователя: </h2>
          <p>Name</p>
        </div>
        <div>
          <h2>Страна проживания: </h2>
          <p>Country</p>
        </div>
      </div>

      <div className='profileRight'></div>
    </div>
  )
}

export default Profile
