import React from 'react';
import { Switch, Route } from "react-router-dom";
import About from './About';
import Login from './RegisterLogin/login';
import Register from './RegisterLogin/register';
import Home from './Home';

function App() {
  return (
    <div>
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/" exact component={Home} />
        <Route path="/register" component={Register} />
      </Switch>
    </div>
  );
}

export default App;
