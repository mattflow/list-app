import React, { Component } from 'react';
import Layout from './components/Layout';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    height: '100%',
  },
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      lists: undefined,
    };
  }

  componentDidMount() {
    fetch('api/lists').then(response => response.json())
      .then(responseJson => {
        this.setState({
          lists: responseJson,
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Layout>
          {
            this.state.lists ? this.state.lists.map(list => 
              <Typography>{list.id}: {list.name}</Typography>
            ) : <Typography>Loading...</Typography>
          }
        </Layout>
      </div>
    );
  }
}

export default withStyles(styles)(App);
