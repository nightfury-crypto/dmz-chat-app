import React from 'react';
import ReactDOM from 'react-dom';
import { hydrate, render } from "react-dom";
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { StatusContextProvider } from './context/StatusContext';


const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<AuthContextProvider>
    <StatusContextProvider>
      <ChatContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatContextProvider>
    </StatusContextProvider>
  </AuthContextProvider>, rootElement);
} else {
  render(<AuthContextProvider>
    <StatusContextProvider>
      <ChatContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatContextProvider>
    </StatusContextProvider>
  </AuthContextProvider>, rootElement);
}