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
import { deepCopy, putData } from './utils';
import _ from 'lodash';

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
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
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

  handleFavoriteClick(list) {
    return () => {
      const data = {
        name: list.name,
        favorited: !list.favorited,
        favoritedAt: Date.now(),
      };

      const lists = this.state.lists.map(list => deepCopy(list));
      const index = _.findIndex(lists, (o) => o._id === list._id);
      lists[index].favorited = data.favorited;
      lists[index].favoritedAt = data.favoritedAt;
      this.setState({
        lists,
      });

      putData(`/api/lists/${list._id}`, data);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <Layout>
            {
              this.state.lists ? _.sortBy(this.state.lists, 
                (o) => {
                  return !o.favorited;
                }).map((list, index) => (
                  <Grid key={shortid.generate()} item xs={12} md={6}>
                    <ListPaper onFavoriteClick={this.handleFavoriteClick(list)} name={list.name} createdAt={list.createdAt} favorited={list.favorited} />
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
