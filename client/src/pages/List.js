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
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';

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
});

function formatDate(date) {
  return moment(date).format('MM/DD');
}

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: undefined,
    };
  }

  componentDidMount() {
    fetch(`/api/lists/${this.props.match.params.listId}`)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          list: responseJson,
        });
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
                            <TableCell><Checkbox checked={item.checked} className={classes.checkbox} /></TableCell>
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
                              <TableCell><Checkbox checked={item.checked} className={classes.checkbox} /></TableCell>
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
            </div>
          </div>
        }
      </div>
    );
  }
}

export default withStyles(styles)(List);