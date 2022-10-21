import React from 'react'
import './Mainscreen.css'
import SearchIcon from '@mui/icons-material/Search';
import Header from '../../components/header/Header';

function Mainscreen() {
  const allchats = [
    { name: 'pia', status: '1m ago', bgColor: '#FF5959' },
    { name: 'John Wick', status: 'online', bgColor: '#D5E32C' },
    { name: 'bae <3', status: 'new message', bgColor: '#0CC7BC' },
    { name: 'deemak', status: 'theek hai yrr..', bgColor: '#40A41D' },
    { name: 'no alcohol gang', status: 'karnail left', bgColor: '#838383' },
  ]
  return (
    <div className='mainscreen'>
      <Header />
      <div className="main__search">
        <div className="search__div">
          <input type="search" name="" id="" placeholder='Search here' />
          <SearchIcon />
        </div>
      </div>

      <div className="all__chats">
        {allchats.map((chat, id) => 
          <div className="chat__card" key={id}>
            <div className="profile" style={{backgroundColor: chat.bgColor}}></div>
            <div className="info">
              <span className="name">{chat.name}</span>
              <p className="seen">{chat.status}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Mainscreen;