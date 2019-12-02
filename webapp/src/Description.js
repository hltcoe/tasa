import React from 'react';

class Description extends React.Component {
  render() {
    if (this.props.text) {
      return (
          <div>
            <h1>{this.props.text}</h1>
          </div>
      );
    }
    else {
      return null;
    }
  }
}

export default Description;
