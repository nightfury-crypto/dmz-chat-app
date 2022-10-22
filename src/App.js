import { useState } from 'react';
import './App.css';
import Auth from './pages/auth/Auth';
import ChatRoom from './pages/chatroom/ChatRoom';
import Mainscreen from './pages/mainscreen/Mainscreen';
import { Routes, Route } from "react-router-dom";

function App() {
  const [isLogging, setisLogging] = useState(false)



  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // on resize
  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={isLogging ? <Mainscreen /> : <Auth setisLogging={setisLogging} />} />
        <Route path='/chatroom/:roomId' element={<ChatRoom />} />
      </Routes>
    </div>
  );
}

export default App;
