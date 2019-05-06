import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Login from './pages/Login'
import Characters from './pages/Characters'
import Edit from './pages/New'
import Skills from './pages/Skills'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" component={Login} ></Route>
          <Route path="/characters" component={Characters}></Route>
          <Route path="/skills" component={Skills}></Route>
          <Route path='/new' component={Edit}></Route>
        </div>
      </Router>
    </div>
  );
}

export default App;
