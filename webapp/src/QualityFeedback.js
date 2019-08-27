import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const styles = {
  root: {
    margin: '0px 30px 20px 30px',
  },
};

const MySlider = (props) => {
  const {title, value, qualityScale, onChange} = props;

  return <React.Fragment>
    <Typography variant="h6">{title}</Typography>
    <Typography id="sliderLabel" paragraph>Current Value: {value}</Typography>

    <Slider
      value={value}
      min={1}
      max={qualityScale}
      step={1}
      aria-labelledby="sliderLabel"
      onChange={onChange}
    />
  </React.Fragment>
};

// CheckBoxes are not used, but preversed in the code for future use.
/*
const MyCheckboxes = (props) => {
  const { notGrammatical, notPreservingMeaning,
          handleCheckBoxChange} = props;

  return <React.Fragment>
    <Typography variant="h6">If you felt there were big problems with the translation, was it
  because of either/both of:</Typography>
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={notGrammatical}
            onChange={handleCheckBoxChange('notGrammatical')}
            value="notGrammatical" color="primary"
          />
        }
        label="Not grammatical"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={notPreservingMeaning}
            onChange={handleCheckBoxChange('notPreservingMeaning')}
            value="notPreservingMeaning" color="primary"
          />
        }
        label="Does not preserve meaning"
      />
    </FormGroup>
  </React.Fragment>
};
*/

class QualityFeedback extends React.Component {
  state = {
    //translationValue: 3,
    grammaticalCorrectness: 3,
    meaningCapturing: 3,
  };

  componentDidMount(){
    this.props.modifyAdditionalData('grammaticalCorrectness', this.state.grammaticalCorrectness);
    this.props.modifyAdditionalData('meaningCapturing', this.state.meaningCapturing);
  }

  handleSliderChange = key => (event, value) => {
    this.setState({ [key]: value });
    this.props.modifyAdditionalData(key, value);
  };

  handleCheckBoxChange = name => event => {
    this.setState({ [name]: event.target.checked });
    this.props.modifyAdditionalData(name, event.target.checked);
  };

  render() {
    const { classes, qualityScale } = this.props;
    const { grammaticalCorrectness, meaningCapturing } = this.state;

    return (
      <div className={classes.root}>
        <Grid container spacing={10}>
          <Grid item xs={6}>
            <MySlider
              qualityScale={qualityScale}
              title={`How grammatically correct is the translation? 1: random
                word order, ${qualityScale}: NY Times quality writing.`}
              value={grammaticalCorrectness}
              onChange={this.handleSliderChange("grammaticalCorrectness")}
            />
          </Grid>
          <Grid item xs={6}>
            <MySlider
              qualityScale={qualityScale}
              title={`How well does the translation capture the intended
                meaning? 1: incomprehensible, ${qualityScale}: perfectly
                matches the intent of the original sentence.`}
              value={meaningCapturing}
              onChange={this.handleSliderChange("meaningCapturing")}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

QualityFeedback.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QualityFeedback);
