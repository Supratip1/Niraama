// src/App.js
import React from 'react';
import Navbar from './components/Navbar';
import ChatWindow from './components/Chatwindow';

const App = () => {
  return (
    <div className="flex h-screen">
      <Navbar />
      {/* Transparent vertical line for separation */}
      <div className="w-1 bg-transparent"></div> {/* Changed to transparent */}
      <ChatWindow />
    </div>
  );
};

export default App;
