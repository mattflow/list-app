import React, { Component } from 'react';
import Layout from './components/Layout';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Lists from './pages/Lists';
import List from './pages/List';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
});

const styles = theme => ({
  root: {
    height: '100%',
    backgroundColor: theme.palette.background.default,
  },
});

class App extends Component {

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <Router>
            <Layout>
              <Route exact path="/" component={Lists} />
              <Route path="/list/:listId" component={List} />
            </Layout>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
