import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Login from './pages/Login'
import Characters from './pages/Characters'
import Edit from './pages/New'
import Skills from './pages/Skills'
import Fight from './pages/Fight'
import EditPage from './pages/Edit';
import Spells from './pages/Spells';
import './App.css'
import Pack from './pages/Pack';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" component={Login} ></Route>
          <Route path="/characters" component={Characters}></Route>
          <Route path="/skills" component={Skills}></Route>
          <Route path='/new' component={Edit}></Route>
          <Route path="/fight" component={Fight}></Route>
          <Route path='/edit' component={EditPage}></Route>
          <Route path='/spells' component={Spells}></Route>
          <Route path='/pack' component={Pack}></Route>
        </div>
      </Router>
    </div>
  );
}

export default App;
