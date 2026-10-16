
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './views/Login';
import MultiPanelViewer from './components/MultiPanelViewer/MultiPanelViewer';
import './firebase'
import CharacterCreation from './views/CharacterCreation/CharacterCreation';
import Header from './components/Header/Header';
import GuestBanner from './components/GuestBanner/GuestBanner';
import { DiceRollerProvider } from './components/DiceRollerDialog/DiceRollerProvider';
import Resources from './views/Resources/Resources';
import MonstersAndInitiative from './views/MonstersAndInitiative/MonstersAndInitiative';

function App() {
  return (
    <div className="App">
      <Router>
        <DiceRollerProvider>
        <div id='app-container' >
          <GuestBanner />
          <Header />
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/character-create' element={<CharacterCreation />} />
            <Route path='/resources' element={<Resources />} />
            <Route path='/multi' element={<MultiPanelViewer />} />
            <Route path="/monsters" element={<MonstersAndInitiative />} />
          </Routes>
        </div>
        </DiceRollerProvider>
      </Router>
    </div>
  );
}

export default App;
