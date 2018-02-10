const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { setTitleRequest } = require('../../actions/headerActions');

/**
 * For over md: show in header
 * For under md: hide in header, show inline
 * 
 * @extends Component
 */
class SetHeaderTitle extends React.Component {
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

SetHeaderTitle.propTypes = {
	setTitleRequest: PropTypes.func.isRequired,
	title: PropTypes.string
};

SetHeaderTitle.defaultProps = {
	title: 'powerplant'
};

module.exports = connect(null, { setTitleRequest })(SetHeaderTitle);
