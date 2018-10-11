import React, { Component } from 'react';
import TitleBar from './components/TitleBar';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Loading...',
    };
  }

  componentDidMount() {
    fetch('api').then(response => response.json())
      .then(responseJson => {
        this.setState({
          message: responseJson.message,
        });
      });
  }

  render() {
    return (
      <div className="App">
        <TitleBar title="List App" />
        {this.state.message}
      </div>
    );
  }
}

export default App;
