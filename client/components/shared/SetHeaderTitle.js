import React from 'react';
import PropTypes from 'prop-types';
import {Col} from 'react-bootstrap';
import {connect} from 'react-redux';
import {setTitle} from '/client/actions/headerActions';

// for over md: show in header
// for under md: hide in header, show inline

class SetHeaderTitle extends React.Component {
  static propTypes = {
    setTitle: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.setTitle(this.props.children);
  }

  //
  // this might be a hacky solution
  // but I like that you can have regular title elements in components
  // so I will keep it
  render() {
    return null;
  }
}

export default connect(null, {setTitle})(SetHeaderTitle);
