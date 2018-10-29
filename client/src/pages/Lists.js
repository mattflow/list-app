import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from 'lodash';
import shortid from 'shortid';
import Grid from '@material-ui/core/Grid';
import ListPaper from '../components/ListPaper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ConfirmDialog from '../components/ConfirmDialog';
import { listsFetchIntervalSeconds } from '../config';
import { deepCopy, putData, postData, deleteMethod } from '../utils';
import TextField from '@material-ui/core/TextField';
import update from 'immutability-helper';

const styles = theme => ({
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

const fetchIntervalTime = listsFetchIntervalSeconds * 1000;

class Lists extends Component {
  constructor() {
    super();
    this.state = {
      lists: undefined,
      showCreateListDialog: false,
      newListName: '',
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

  handleFavoriteClick = (list) => {
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

  handleDeleteClick = (list) => {
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
    if (this.state.newListName.trim() !== '') {
      clearInterval(this.fetchInterval);
      const list = {
        name: this.state.newListName,
        favorited: false,
      };

      postData('/api/lists', list).then(newList => {
        this.fetchInterval = window.setInterval(this.fetchLists, fetchIntervalTime);
        const newState = update(this.state, {
          lists: { $push: [list] },
        });
        this.setState(newState);
        this.handleNewListClose();
      });
    }
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
      <Grid container spacing={16}>
        {
          this.state.lists ? _.sortBy(this.state.lists, 
            (o) => {
              return !o.favorited;
            }).map((list, index) => (
              <Grid key={shortid.generate()} item xs={12} md={6}>
                <ListPaper 
                  onDeleteClick={this.handleDeleteClick(list)} 
                  onFavoriteClick={this.handleFavoriteClick(list)} 
                  list={list}
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
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Lists);