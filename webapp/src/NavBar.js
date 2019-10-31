import React, {PureComponent} from "react";
import PropTypes from "prop-types";

import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from "@material-ui/core/Typography/Typography";
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import "./NavBar.css"
import SourceLangPanel from "./SourceLangPanel";

class NavBar extends PureComponent {
  render() {
    return (
      <div className="navbar">
        <Grid container spacing={16}>
          <Grid item xs={2}/>
          <Grid item xs={1}>
            <Button variant="contained" color="primary"
                    onClick={this.props.prevData}>
              Prev
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" color="inherit" align="center">
              Current progress: {this.props.dataIdx}/{this.props.totalData}.
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary"
                    onClick={this.props.nextData}>
              Next
            </Button>
          </Grid>
          <Grid item xs={2}/>
        </Grid>

        <Stepper activeStep={1}>
          <Step key={'1'} >
            <StepLabel> automatic translation </StepLabel>
          </Step>
          <Step key={'1'} >
            <StepLabel> check tokenization </StepLabel>
          </Step>
          <Step key={'2'} >
            <StepLabel> alignment annotation </StepLabel>
          </Step>
        </Stepper>

        <Grid container spacing={16}>
          <Grid item xs={5}/>
          <Grid item xs={1}>
            <Button variant="contained" color="primary">
              TRANSLATE
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary">
              Finish Tokenization
            </Button>
          </Grid>

          <Grid item xs={3}>

          </Grid>
          <Grid item xs={2}/>
        </Grid>
      </div>
    );
  }
}
SourceLangPanel.propTypes = {
  dataIdx: PropTypes.number,
  totalData: PropTypes.number,
  prevData: PropTypes.func,
  nextData: PropTypes.func,
};
export default NavBar