import { useState } from 'react';
import './App.css';
import Auth from './pages/auth/Auth';
import ChatRoom from './pages/chatroom/ChatRoom';
// import Mainscreen from './pages/mainscreen/Mainscreen';

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
      {isLogging ? <ChatRoom /> : <Auth setisLogging={setisLogging} />}
      {/* <UserProfile /> */}
    </div>
  );
}

export default App;
