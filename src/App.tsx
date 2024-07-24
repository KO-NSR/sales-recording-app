import React from 'react';
import logo from './logo.svg';
import './App.css';
import Camera from './components/camera';
import CameraWithQRCode from './components/camera';

function App() {
  return (
    <div className="App">
      <header className='bg-blue-400 font-bold underline mt-10 text-4xl'>testtest</header>
      <CameraWithQRCode />
    </div>
  );
}

export default App;
