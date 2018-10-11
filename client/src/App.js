import React, { Component } from 'react';
import TitleBar from './components/TitleBar';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TitleBar title="List App" />
      </div>
    );
  }
}

export default App;
