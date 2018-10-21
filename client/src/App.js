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
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ConfirmDialog from './components/ConfirmDialog';
import { listFetchIntervalSeconds } from './config';
import { deepCopy, putData, postData, deleteMethod } from './utils';
import _ from 'lodash';
import TextField from '@material-ui/core/TextField';

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
  floatingAdd: {
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
    position: 'fixed',
  },
});

const fetchIntervalTime = listFetchIntervalSeconds * 1000;

class App extends Component {
  constructor() {
    super();
    this.state = {
      lists: undefined,
      showCreateListDialog: false,
      newListName: '',
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
      setTimeout(() => {
        this.setState({
          lists,
        });
      }, 250);

      putData(`/api/lists/${list._id}`, data);
    }
  }

  handleDeleteClick(list) {
    return () => {
      if (window.confirm('Are you sure you would like to delete this list?')) {
        deleteMethod(`/api/lists/${list._id}`);

        const lists = this.state.lists.map(list => deepCopy(list));
        const index = _.findIndex(lists, (o) => o._id === list._id);
        lists.splice(index, 1);
        setTimeout(() => {
          this.setState({
            lists,
          });
        }, 250);
      }
    }
  }

  handleNewListClose = () => {
    this.setState({
      showCreateListDialog: false,
      newListName: '',
    });
  }

  handleNewListClick = () => {
    this.setState({
      showCreateListDialog: true,
    });
  }

  handleNewListConfirm = () => {
    const list = {
      name: this.state.newListName,
      favorited: false,
      createdAt: Date.now(),
    };

    postData('/api/lists', list);

    const lists = this.state.lists.map(list => deepCopy(list));
    lists.push(list);

    this.setState({
      lists,
    });

    this.handleNewListClose();
  }

  handleNewListNameChange = (e) => {
    this.setState({
      newListName: e.target.value,
    });
  }

  handleNewListNameInput = (e) => {
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13) {
      this.handleNewListConfirm();
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
                    <ListPaper 
                      onDeleteClick={this.handleDeleteClick(list)} 
                      onFavoriteClick={this.handleFavoriteClick(list)} 
                      name={list.name} 
                      createdAt={list.createdAt} 
                      favorited={list.favorited} 
                    />
                  </Grid>
                )) : <CircularProgress className={classes.loadingCircle} color="secondary" />
            }
            <Button onClick={this.handleNewListClick} variant="fab" color="primary" aria-label="Add" className={classes.floatingAdd}>
              <AddIcon />
            </Button>
            <ConfirmDialog
              open={this.state.showCreateListDialog}
              onClose={this.handleNewListClose}
              onConfirm={this.handleNewListConfirm}
              title="New List"
              confirmButton="Create"
              closeButton="Cancel"
            >
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                value={this.state.newListName}
                onChange={this.handleNewListNameChange}
                onKeyPress={this.handleNewListNameInput}
                placeholder="Groceries..."
              />
            </ConfirmDialog>
          </Layout>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
