import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import moment from 'moment';
import ClearIcon from '@material-ui/icons/Clear';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3,
    clear: 'both',
    overflow: 'hidden',
  },
  rightButton: {
    float: 'right',
  },
  favoriteButton: {
    marginTop: theme.spacing.unit * -2,
    marginLeft: theme.spacing.unit,
  },
  deleteContainer: {
    float: 'right',
  },
  deleteButton: {
    marginTop: theme.spacing.unit * -2,
    marginLeft: 'auto',
  },
  toolbar: {
    paddingLeft: 0,
    paddingRight: 0,
  }
});

function ListPaper(props) {
  const { classes } = props;

  return (
    <div>
      <Paper className={classes.root} elevation={1}>
        <Toolbar className={classes.toolbar}>
          <div>
            <Typography variant="h5">
              {props.list.name}
            </Typography>
            <Typography variant="caption">
              {moment(props.list.createdAt).format('MM/DD/YY')}
            </Typography>
          </div>
          <IconButton onClick={props.onFavoriteClick} className={classes.favoriteButton} color="primary" aria-label="Favorite">
            {
              props.list.favorited ?
              <StarIcon /> :
              <StarBorderIcon />
             }
          </IconButton>
          <IconButton onClick={props.onDeleteClick} aria-label="Delete" className={classes.deleteButton}>
            <ClearIcon />
          </IconButton>
        </Toolbar>
        <Link to={"/list/" + props.list._id}>
          <Button className={classes.rightButton} variant="contained" color="secondary">Open</Button>
        </Link>
      </Paper>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(ListPaper);