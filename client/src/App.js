import React, { Component } from 'react';
import Layout from './components/Layout';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import shortid from 'shortid';
import Grid from '@material-ui/core/Grid';
import ListPaper from './components/ListPaper';
import { listFetchIntervalSeconds } from './config';

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
  loadingCircle: {
    display: 'block',
    margin: 'auto',
  },
});

const fetchIntervalTime = listFetchIntervalSeconds * 1000;

class App extends Component {
  constructor() {
    super();
    this.state = {
      lists: undefined,
    };
  }

  fetchLists = (cb) => {
    fetch('api/lists').then(response => response.json())
      .then(responseJson => {
        this.setState({
          lists: responseJson,
        });
        cb && cb();
      });
  }

  componentDidMount() {
    this.fetchLists(() => {
      this.fetchInterval = window.setInterval(this.fetchLists, fetchIntervalTime);
    });
  }

  componentWillUnmount() {
    clearInterval(this.fetchInterval);
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <Layout>
            {
              this.state.lists ? this.state.lists.map((list, index) => (
                <Grid key={shortid.generate()} item xs={12} md={6}>
                  <ListPaper name={list.name} createdAt={list.createdAt} favorited={list.favorited} />
                </Grid>
              )) : <CircularProgress className={classes.loadingCircle} color="secondary" />
            }
          </Layout>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
