
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './views/Login';
import MultiPannelViewer from './components/MultiPannelViewer/MutliPannelViewer';
import './firebase'
import CharacterCreation from './views/CharacterCreation/CharacterCreation';
import Header from './components/Header/Header';
import Resources from './views/Resources/Resources';
import MonstersAndInitiative from './views/MonstersAndInitiative/MonstersAndInitiative';

function App() {
  return (
    <div className="App">
      <Router>
        <div id='app-container' >
          <Header />
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/character-create' element={<CharacterCreation />} />
            <Route path='/resources' element={<Resources />} />
            <Route path='/multi' element={<MultiPannelViewer />} />
            <Route path="/monsters" element={<MonstersAndInitiative />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
