import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button/Button";
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
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

class SourceLangPanel extends React.Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.state = {
      editMode: false,
      sourceTextDirection: props.config.sourceTextDirection,
      tokenJoinedText: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasFocus === this.props.hasFocus)
      return;
    this.setKeyHandling(nextProps.hasFocus);
  }

  componentDidMount() {
    // Add Event Listener on component mount
    window.addEventListener("keyup", this.keyHandling);
  }

  componentWillUnmount() {
    // Remove event listener on compenent unmount
    window.removeEventListener("keyup", this.keyHandling);
  }

  setKeyHandling(enable){
    console.log(`setKeyHandlingEnable: ${enable}`);
    if (enable)
      window.addEventListener("keyup", this.keyHandling);
    else
      window.removeEventListener("keyup", this.keyHandling);
  }

  decrementPos = () => {
    let newPos = this.props.currentPos - 1;
    while (newPos >= 0 && this.props.headInds.size > 0 && !this.props.headInds.has(newPos)){
      newPos -= 1;
    }
    this.props.moveSrcPos(newPos);
  }

  incrementPos = () => {
    let newPos = this.props.currentPos + 1;
    while (newPos < this.props.tokens.length && this.props.headInds.size > 0 && !this.props.headInds.has(newPos)){
      newPos += 1;
    }
    this.props.moveSrcPos(newPos);
  }

  keyHandling = (e) => {
    // Handle event
    switch(e.code){
    case "KeyA":
    case "ArrowLeft":
      if (this.state.sourceTextDirection === 'rtl') {
        this.incrementPos();
      }
      else {
        this.decrementPos();
      }
      break;

    case "KeyD":
    case "ArrowRight":
      if (this.state.sourceTextDirection === 'rtl') {
        this.decrementPos();
      }
      else {
        this.incrementPos();
      }
      break;

    default:
    }
  };

  handleEnterEditMode = () => {
    // Remove event listener on compenent unmount
    window.removeEventListener("keyup", this.keyHandling);
    this.setState({
      editMode: true,
      tokenJoinedText: this.props.tokens.join('\n')
    });
  };

  handleLeaveEditMode = () => {
    // Add Event Listener on component mount
    window.addEventListener("keyup", this.keyHandling);
    this.setState({editMode: false});
    let newTokens = document.getElementById("srcTokensTextField").value.split("\n");
    this.props.changeTokens(newTokens);
  };

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

  handleSetTextDirectionLTR = () => {
    this.setState({
      sourceTextDirection: 'ltr'
    });
  }

  handleSetTextDirectionRTL = () => {
    this.setState({
      sourceTextDirection: 'rtl'
    });
  }

  handleTokenClick = (idx) => () => {
    this.props.moveSrcPos(idx);
  }

  render() {
    //if (this.props.showFeedback)
    //  return this.renderFeedbackMode();
    if (this.state.editMode)
      return this.renderEditMode();
    else
      return this.renderNormalMode();
  }


  renderNormalMode(){
    //const config = this.props.config;
    //const tokens = this.props.tokens;
    const {classes, tokens, isBlurry,
           selections, currentPos, colors,
           headInds, goldAlignment, showFeedback} = this.props;

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
                  handleHoverOff={this.handleHoverOff}/>

        tokenChips.push(chip);
        continue;
      }

      if (showFeedback) {
        // if tokens[idx] is correct.
        // eslint-disable-next-line no-loop-func
        const correct = selections[idx].every((s,i) => s === goldAlignment[idx][i]);
        if (correct)
          className += ` ${classes.correctToken}`;
        else
          className += ` ${classes.wrongToken}`;
      }

      // if tokens[idx] is touched.
      const touched = selections[idx].some(b => b)
      if (touched && !showFeedback)
        className += ` ${classes.touchedToken}`;

      // if tokens[idx] is active (currently selected)
      if (idx === currentPos) {
        className += ` ${classes.activeToken}`;
        chip = <TokenChip
                  key={idx} idx={idx} token={tokens[idx]}
                  style={{fontSize: this.props.fontSize}}
                  className={className}
                  handleHoverOn={this.handleHoverOn(idx)}
                  handleHoverOff={this.handleHoverOff}/>
      } else if (headInds.size === 0) {
        // headInds empty, and tokens[idx] is selectable.
        chip = <TokenChip
                  key={idx} idx={idx} token={tokens[idx]}
                  style={{fontSize: this.props.fontSize,
                          backgroundColor: colors[idx]}}
                  className={className}
                  handleHoverOn={this.handleHoverOn(idx)}
                  handleHoverOff={this.handleHoverOff}
                  onClick={this.handleTokenClick(idx)} />
      } else if (headInds.size > 0 && headInds.has(idx)) {
        // headInds not empty, and tokens[idx] is selectable.
        className += ` ${classes.boldedToken}`;
        chip = <TokenChip
                  key={idx} idx={idx} token={tokens[idx]}
                  style={{fontSize: this.props.fontSize,
                          backgroundColor: colors[idx]}}
                  className={className}
                  handleHoverOn={this.handleHoverOn(idx)}
                  handleHoverOff={this.handleHoverOff}
                  onClick={this.handleTokenClick(idx)} />
      } else {
        // tokens[idx] is disabled.
        className += ` ${classes.disabledToken}`;
        chip = <TokenChip
                  key={idx} idx={idx} token={tokens[idx]}
                  style={{fontSize: this.props.fontSize,
                          backgroundColor: colors[idx]}}
                  className={className}
                  handleHoverOn={this.handleHoverOn(idx)}
                  handleHoverOff={this.handleHoverOff}/>
      }

      // push `chip` to `tokenChips`.
      tokenChips.push(chip);
    }

    return (
      <Paper className="panel" elevation={4}>
        {this.props.config.showTextDirectionButtons?
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
            <Button variant="outlined"
                    onClick={this.handleSetTextDirectionLTR}>
              <FormatAlignLeftIcon />
            </Button>
            <Button variant="outlined" color="default"
                    onClick={this.handleSetTextDirectionRTL}>
              <FormatAlignRightIcon />
            </Button>
          </div>:
          null
        }
        <Grid container spacing={2}>
          <Grid item xs={11} dir={this.state.sourceTextDirection}>
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
          id="srcTokensTextField"
          label="Edit tokens" multiline fullWidth
          defaultValue={this.state.tokenJoinedText}
          margin="normal" variant="outlined" />
      </Paper>
    )
  }
}
SourceLangPanel.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.string),
  currentPos: PropTypes.number,
  moveSrcPos: PropTypes.func,
  changeTokens: PropTypes.func,
};
export default withStyles(styles)(SourceLangPanel);
