import React from 'react';
import Header from '../../components/header/Header';
import './UserProfile.css'

function UserProfile() {
  return (
    <div className='userprofile'>
      <Header />
      <div className="userprofile__content">
        <div className="userprofile__pic">
          <div className="pic"></div>
          <label htmlFor="uploadpic">change profile pic <span></span></label>
          <input type="file" name="uploadpic" id="uploadpic" />
        </div>
        

      </div>


    </div>
  )
}

export default UserProfile