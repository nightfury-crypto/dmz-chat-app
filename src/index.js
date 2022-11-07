import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { StatusContextProvider } from './context/StatusContext';
import { hydrate, render } from "react-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));

if (root.hasChildNodes()) {
  hydrate(<AuthContextProvider>
    <StatusContextProvider>
      <ChatContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatContextProvider>
    </StatusContextProvider>
  </AuthContextProvider>, root);
} else {
  render(<AuthContextProvider>
    <StatusContextProvider>
      <ChatContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatContextProvider>
    </StatusContextProvider>
  </AuthContextProvider>, root);
}
root.render(

);

