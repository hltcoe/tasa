import React from "react";
import PropTypes from "prop-types";

import Chip from "@material-ui/core/Chip";

import "./Panel.css"

class TokenChip extends React.Component {
  shouldComponentUpdate(nextProps) {
    //console.log(nextProps);
    //console.log(this.props);
    if (this.props.idx !== nextProps.idx) {
      return true;
    } else if (this.props.tokens !== nextProps.tokens) {
      return true;
    } else if (this.props.className !== nextProps.className) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const {idx, token, className, style,
           handleHoverOn, handleHoverOff,
           ...otherProps} = this.props;
    return <Chip label={token}
               className={className}
               onMouseEnter={handleHoverOn}
               onMouseLeave={handleHoverOff}
               style={style}
               {...otherProps} />
  }
}
TokenChip.propTypes = {
  idx: PropTypes.number,
  token: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  handleHoverOn: PropTypes.func,
  handleHoverOff: PropTypes.func,
};
export default TokenChip;
