
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './views/Login';
import CharacterSelect from './views/CharacterSelect/CharacterSelect'
import Skills from './views/Skills/Skills'
import Fight from './views/Fight/Fight';
import Pack from './views/Pack/Pack';
import NewCharacter from './views/NewCharacter'
import EditPage from './views/EditPage';
import './firebase'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login />} ></Route>
          <Route path='/characters' element={<CharacterSelect />} />
          <Route path='/skills' element={<Skills />} ></Route>
          <Route path='/fight' element={<Fight />} />
          <Route path='/pack' element={<Pack />} />
          <Route path='/edit' element={<EditPage />} />
          <Route path='/new' element={<NewCharacter />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
