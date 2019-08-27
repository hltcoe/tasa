import React, {PureComponent} from "react";

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import "./Header.css"

class Header extends PureComponent {
  constructor(props){
    super(props);

    this.state = {
      anchorEl: null,
      dialogOpen: false,
    };
  }

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleDialogOpen = () => {
    this.setState({dialogOpen: true});
  }

  handleDialogClose = () => {
    this.setState({dialogOpen: false});
  }

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography className='appbarSpace' variant="h6" color="inherit">
              Annotator App
            </Typography>

            {this.props.trainingBtn}
            <Button
              color="inherit"
              aria-owns={anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleMenuClick}
            >
              font size
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleMenuClose}
            >
              <MenuItem onClick={() => {
                  this.props.handleFontSizeChange('small');
                  this.handleMenuClose();
                }}>small</MenuItem>
              <MenuItem onClick={() => {
                  this.props.handleFontSizeChange('medium');
                  this.handleMenuClose();
                }}>medium</MenuItem>
              <MenuItem onClick={() => {
                  this.props.handleFontSizeChange('large');
                  this.handleMenuClose();
                }}>large</MenuItem>
            </Menu>

            <Button color="inherit" onClick={this.handleDialogOpen}>
              Show Instructions
            </Button>
          </Toolbar>
        </AppBar>

        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose} aria-labelledby="simple-dialog-title">
          <DialogTitle>Instructions</DialogTitle>
          <Typography className='dialogText'>
            Before starting, please read the annotation guidelines
            <a
              href="https://esteng.github.io/annotation/guidelines_for_mturk"
              target="_blank" rel="noopener noreferrer"
            >here</a> <br />
            Use key A/D or left/right to move along source sentence. <br/>
            Use mouse click to toggle selection of each target sentence token. <br/>
          </Typography>
        </Dialog>

      </div>
    )
  }
}
export default Header
