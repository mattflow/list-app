import React, { Component } from 'react';
import Layout from './components/Layout';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Lists from './pages/Lists';
import List from './pages/List';

class App extends Component {

  render() {
    return (
      <Router>
        <Layout>
          <Route exact path="/" component={Lists} />
          <Route path="/list/:listId" component={List} />
        </Layout>
      </Router>
    );
  }
}

export default App;
