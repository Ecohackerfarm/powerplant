import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Navbar} from 'react-bootstrap';

class HeaderBrand extends React.Component {
  static propTypes = {
    title: PropTypes.string
  }

  static defaultProps = {
    title: 'powerplant v0.6'
  }

  render() {
    return (
        <Navbar.Brand>{this.props.title}</Navbar.Brand>
    );
  }
}

const stateToProps = (state) => {
  console.log("Detected state change");
  console.log(state);
  return {
    title: state.title
  }
}

// export default Header;
export default connect(stateToProps, null)(HeaderBrand);
