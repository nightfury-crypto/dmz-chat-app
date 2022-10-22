import React from 'react'
import './Mainscreen.css'
import SearchIcon from '@mui/icons-material/Search';
import Header from '../../components/header/Header';
import { Link } from 'react-router-dom';
import { Avatar } from '@mui/material';

function Mainscreen() {
  const allchatsUsers = [
    { name: 'pia', status: '1m ago', bgColor: '#FF5959', profileImg: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'John Wick', status: 'online', bgColor: '#D5E32C', profileImg: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'bae <3', status: 'new message', bgColor: '#0CC7BC', profileImg: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'deemak', status: 'theek hai yrr..', bgColor: '#40A41D', profileImg: 'https://images.pexels.com/photos/1819483/pexels-photo-1819483.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'no alcohol gang', status: 'karnail left', bgColor: '#838383', profileImg: 'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=600' },
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
        {allchatsUsers.map((chat, id) =>
          <Link to={`/chatroom/${id}`} key={id}>
            <div className="chat__card" >
              <div className="profile"><Avatar src={chat.profileImg} alt={chat.name}/></div>
              <div className="info">
                <span className="name">{chat.name}</span>
                <p className="seen">{chat.status}</p>
              </div>
            </div>
          </Link>
        )}

      </div>
    </div>
  )
}

export default Mainscreen;