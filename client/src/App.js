import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.js';
import Processor from './pages/processor';
import NoPages from './pages/NoPages.js';
import Software from './pages/Software.js';
import OpeatingSystem from './pages/OperatingSystem.js';


function App() {
  return(
    <div>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="/processor" element={<Processor/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/software" element={<Software/>}/>
        <Route path="/operatingsystem" element={<OpeatingSystem/>}/>

        <Route path="*" element={<NoPages/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App;
