import React, {PureComponent} from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withStyles } from '@material-ui/styles';

import TokenChip from "./TokenChip"
import "./Panel.css"

const styles = {
  token: {
    margin: '2px 2px',
    border: '3px solid #5550',
  },
  activeToken: {
    color: '#fff',
    backgroundColor: '#3f51b5',
  },
  blurryToken: { filter: 'blur(5px)' },
  boldedToken: { fontWeight: 'bold' },
  correctToken: { border: '3px solid #0f0' },
  disabledToken: { color: '#808080' },
  touchedToken: { border: '3px solid #555' },
  wrongToken: { border: '3px solid #f00' },
};

class TargetLangPanel extends React.Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.state = {
      editMode: false,
      tokenJoinedText: ""
    };
  }

  handleEnterEditMode = () => {
    // Remove event listener on compenent unmount
    this.setState({
      editMode: true,
      tokenJoinedText: this.props.tokens.join('\n')
    })
  };

  handleLeaveEditMode = () => {
    // Add Event Listener on component mount
    this.setState({editMode: false});
    let newTokens = document.getElementById("tarTokensTextField").value.split("\n");
    this.props.changeTokens(newTokens)
  };

  handleClick = (idx) => () => {
    if (this.props.showFeedback)
      return;

    this.props.toggleSelectionAt(idx);
    this.forceUpdate()
  }

  handleHoverOn = (idx) => () => {
    this.timer = setTimeout(() => {
      this.props.setHoverIdx(idx);
      this.timer = null;
    }, 1500);
  }

  handleHoverOff = () => {
    if (this.timer != null) {
      //console.log('clear timeout');
      clearTimeout(this.timer);
      this.timer = null;
    } else {
      this.props.setHoverIdx(null);
    }
  }


  render() {
    if (this.state.editMode)
      return this.renderEditMode();
    else
      return this.renderNormalMode()
  }

  renderNormalMode() {
    const config = this.props.config;
    //const tokens = this.props.tokens;
    const {classes, tokens, selections, currentPos,
           isBlurry, goldAlignment, showFeedback} = this.props;
    const selection = selections[currentPos];

    var tokenChips = [];
    for (var idx = 0; idx < tokens.length; idx++){
      var chip;
      var className = `${classes.token}`;

      // if tokens[idx] is blurry.
      if (isBlurry[idx])
        className += ` ${classes.blurryToken}`;
      else if (isBlurry.some(b => b)){
        className += ` ${classes.activeToken}`;
        chip = <TokenChip
                  key={idx} idx={idx} token={tokens[idx]}
                  style={{fontSize: this.props.fontSize}}
                  className={className}
                  handleHoverOn={this.handleHoverOn(idx)}
                  handleHoverOff={this.handleHoverOff}
                  color="primary" />
        tokenChips.push(chip);
        continue;
      }

      if (showFeedback) {
        // if tokens[idx] is correct.
        const correct = selection[idx] === goldAlignment[currentPos][idx];
        if (correct)
          className += ` ${classes.correctToken}`;
        else
          className += ` ${classes.wrongToken}`;
      }

      // if tokens[idx] is touched.
      var touched = false;
      for (var i = 0; i < selections.length; i++)
        if (selections[i][idx] && !showFeedback) {
          touched = true;
          break;
        }
      if (touched)
        className += ` ${classes.touchedToken}`;

      // if tokens[idx] is active (currently selected)
      if (selection[idx]) {
        // here I must use color='primary'. since material-ui would
        // automatically apply CSS style change for clickable chip
        // on mouse hover and it will override my CSS (activeToken).
        // But still clssName need to be updated to trigger render.
        className += ` ${classes.activeToken}`;
        chip = <TokenChip
                  key={idx} idx={idx} token={tokens[idx]}
                  style={{fontSize: this.props.fontSize}}
                  className={className}
                  handleHoverOn={this.handleHoverOn(idx)}
                  handleHoverOff={this.handleHoverOff}
                  color="primary"
                  onClick={this.handleClick(idx)} />
      } else if (config.headInds.size === 0) {
        // headInds empty, and tokens[idx] is selectable.
        chip = <TokenChip
                  key={idx} idx={idx} token={tokens[idx]}
                  className={className}
                  handleHoverOn={this.handleHoverOn(idx)}
                  handleHoverOff={this.handleHoverOff}
                  onClick={this.handleClick(idx)}
                  style={{fontSize: config.fontSize,
                          backgroundColor: config.colors[idx]}} />
      } else if (config.headInds.size > 0 && config.headInds.has(idx)) {
        // headInds not empty, and tokens[idx] is selectable.
        className += ` ${classes.boldedToken}`;
        chip = <TokenChip
                  key={idx} idx={idx} token={tokens[idx]}
                  className={className}
                  handleHoverOn={this.handleHoverOn(idx)}
                  handleHoverOff={this.handleHoverOff}
                  onClick={this.handleClick(idx)}
                  style={{fontSize: config.fontSize,
                          backgroundColor: config.colors[idx]}} />
      } else {
        // tokens[idx] is disabled.
        className += ` ${classes.disabledToken}`;
        chip = <TokenChip
                  key={idx} idx={idx} token={tokens[idx]}
                  className={className}
                  style={{fontSize: config.fontSize,
                          backgroundColor: config.colors[idx]}} />
      }

      // push `chip` to `tokenChips`.
      tokenChips.push(chip);
    }

    return (
      <Paper className="panel" elevation={4}>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            {tokenChips}
          </Grid>
          <Grid item xs={1}>
            {this.props.enableRetokenize?
              <Button variant="contained" color="primary"
                      onClick={this.handleEnterEditMode}>
                Re-tokenize
              </Button>:
              null
            }
          </Grid>
        </Grid>
      </Paper>
    )
  }

  renderEditMode(){
    return (
      <Paper className="panel" elevation={4}>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <Typography variant="headline" component="h3">
              Source Language
            </Typography>
            <Typography component="p">
              Edit source sentence tokenization. Each line represents a single token.
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary"
                    onClick={this.handleLeaveEditMode}>
              Save
            </Button>
          </Grid>
        </Grid>
        <div className="divider"/>

        <TextField
          id="tarTokensTextField"
          label="Edit tokens" multiline fullWidth
          defaultValue={this.state.tokenJoinedText}
          margin="normal" variant="outlined" />
      </Paper>
    )
  }
}
TargetLangPanel.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.string),
  //selection: PropTypes.array,
  toggleSelectionAt: PropTypes.func
};
export default withStyles(styles)(TargetLangPanel);
