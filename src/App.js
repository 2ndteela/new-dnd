import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Login from './pages/Login'
import Characters from './pages/Characters'
import Edit from './pages/New'

const main = () => {
  return (
    <div>
      <h2>Main App</h2>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" component={Login} ></Route>
          <Route path="/characters" component={Characters}></Route>
          <Route path="/main" component={main}></Route>
          <Route path='/new' component={Edit}></Route>
        </div>
      </Router>
    </div>
  );
}

export default App;
