import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    margin: '0px 30px 20px 30px',
  },
  textfield: {
    width: '40%',
  },
};

class CommentFeedback extends React.Component {
  state = {
    comment: '',
  };

  componentDidMount(){
    //this.props.modifyAdditionalData('comment', this.state.comment);
  }

  handleChange = key => (event) => {
    console.log(key, event.target.value);
    this.setState({ [key]: event.target.value });
    this.props.modifyAdditionalData(key, event.target.value);
  };


  render() {
    const { classes } = this.props;
    const { comment } = this.state;

    return (
      <div className={classes.root}>
        <TextField
          onFocus={this.props.onFocusIn}
          onBlur={this.props.onFocusOut}
          className={classes.textfield}
          label="Comment Box"
          multiline
          rowsMax="4"
          value={comment}
          onChange={this.handleChange('comment')}
          margin="normal"
          variant="outlined"
        />
      </div>
    );
  }
}

CommentFeedback.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommentFeedback);
