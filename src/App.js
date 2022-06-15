
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './views/Login';
import CharacterSelect from './views/CharacterSelect/CharacterSelect'
import NewCharacter from './views/NewCharacter'
import MultiPannelViewer from './components/MultiPannelViewer/MutliPannelViewer';
import './firebase'

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path='/' element={<Login />} ></Route>
            <Route path='/characters' element={<CharacterSelect />} />
            <Route path='/new' element={<NewCharacter />} />
            <Route path='/multi' element={<MultiPannelViewer />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
