import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import "antd/dist/antd.css"
import Login from './components/Login/Login'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Sidebar} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
