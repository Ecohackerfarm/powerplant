import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setTitleRequest } from '/client/actions/headerActions';

// for over md: show in header
// for under md: hide in header, show inline

class SetHeaderTitle extends React.Component {
	static propTypes = {
		setTitleRequest: PropTypes.func.isRequired,
		title: PropTypes.string
	};

	static defaultProps = {
		title: 'powerplant'
	};

	componentWillMount() {
		let title = this.props.children;
		if (!title) {
			title = this.props.title;
		}
		this.props.setTitleRequest(title);
	}

	//
	// this might be a hacky solution
	// but I like that you can have regular title elements in components
	// so I will keep it
	render() {
		return null;
	}
}

export default connect(null, { setTitleRequest })(SetHeaderTitle);
