import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Typography,
  Toolbar,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  TextField,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import update from 'immutability-helper';
import { listFetchIntervalSeconds } from '../config';
import { putData, deleteMethod, postData } from '../utils';

const fetchIntervalTime = listFetchIntervalSeconds * 1000;

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  tableContainer: {
    [theme.breakpoints.up('sm')]: {
      width: 550,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  checkbox: {
    float: 'right',
  },
  checkedExpansionHeader: {
    color: theme.palette.secondary.main,
  },
  noPadding: {
    padding: 0,
  },
  checkedCell: {
    textDecoration: 'line-through',
    color: theme.palette.secondary.main,
  },
  button: {
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 2,
  },
  addButton: {
    marginLeft: theme.spacing.unit,
    minWidth: 100,
  },
});

function formatDate(date) {
  return moment(date).format('MM/DD');
}

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: undefined,
      newItemName: '',
    };
  }

  fetchList = (cb) => {
    fetch(`/api/lists/${this.props.match.params.listId}`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          list: responseJson,
        });
      });

    cb && cb();
  }
  
  componentDidMount() {
    this.fetchList(() => {
      this.fetchInterval = setInterval(this.fetchList, fetchIntervalTime);
    });
  }

  componentWillUnmount() {
    clearInterval(this.fetchInterval)
  }

  handleCheckToggle = index => {
    return () => {
      clearInterval(this.fetchInterval)

      const checked = !this.state.list.items[index].checked;

      const newState = update(this.state, {
        list: { items: { [index]: { checked: { $set: checked}}}}
      });

      this.setState(newState);

      putData(`/api/items/${this.state.list.items[index]._id}`, {
        name: this.state.list.items[index].name,
        checked,
        checkedAt: Date.now(),
      }).then(() => {
        this.fetchInterval = setInterval(this.fetchList, fetchIntervalTime);
      });
    }
  }

  handleRemoveCheckedItemsClick = () => {
    if (window.confirm('Are you sure you would like to clear checked items?')) {
      const toRemove = [];
      let removalCount = 0;
      this.state.list.items.forEach((item, index) => {
        if (item.checked) {
          deleteMethod(`/api/items/${item._id}`);
          toRemove.push([index - removalCount++, 1]);
        }
      });

      const newState = update(this.state, {
        list: {items: {$splice: toRemove}}
      });

      this.setState(newState);
    }
  }

  handleNewItemNameChange = (e) => {
    this.setState({
      newItemName: e.target.value,
    });
  }

  handleNewItemNameKeyPress = (e) => {
    const keyCode = e.which || e.keyCode;

    if (this.state.newItemName.trim() !== '' && keyCode === 13) {
      this.handleNewItemButtonClick();
    }
  }

  handleNewItemButtonClick = () => {
    clearInterval(this.fetchInterval);
    const data = {
      name: this.state.newItemName,
      checked: false,
    };


    postData(`/api/lists/${this.state.list._id}/items`, data)
      .then(responseJson => {
        const newState = update(this.state, {
          list: {items: {$push: [responseJson]}}
        });

        newState.newItemName = '';

        this.setState(newState);
        this.fetchInterval = setInterval(this.fetchList, fetchIntervalTime);
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {
          this.state.list === void 0 ? <Typography variant="h5">Loading...</Typography> :
          <div className={classes.root}>
            <div className={classes.tableContainer}>
              <Paper>
                <Toolbar>
                  <Typography variant="h6">{this.state.list.name}</Typography>
                </Toolbar>
                <Toolbar>
                  <TextField
                    value={this.state.newItemName}
                    onChange={this.handleNewItemNameChange} 
                    onKeyPress={this.handleNewItemNameKeyPress}
                    fullWidth
                    placeholder="New item..."
                  />
                  <Button onClick={this.handleNewItemButtonClick} className={classes.addButton} color="primary">Add Item</Button>
                </Toolbar>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.list.items.map((item, index) => {
                      if (!item.checked) {
                        return (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{formatDate(item.createdAt)}</TableCell>
                            <TableCell><Checkbox onChange={this.handleCheckToggle(index)} checked={item.checked} className={classes.checkbox} /></TableCell>
                          </TableRow>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </TableBody>
                </Table>
              </Paper>
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.checkedExpansionHeader}>Checked Items</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.noPadding}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.list.items.map((item, index) => {
                        if (item.checked) {
                          return (
                            <TableRow key={index}>
                              <TableCell className={classes.checkedCell}>{item.name}</TableCell>
                              <TableCell className={classes.checkedCell}>{formatDate(item.createdAt)}</TableCell>
                              <TableCell><Checkbox onChange={this.handleCheckToggle(index)} checked={item.checked} className={classes.checkbox} /></TableCell>
                            </TableRow>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </TableBody>
                  </Table>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <Button onClick={this.handleRemoveCheckedItemsClick} className={classes.button} color="secondary">Clear Checked Items</Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default withStyles(styles)(List);