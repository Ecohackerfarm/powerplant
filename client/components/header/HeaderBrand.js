/**
 * @namespace HeaderBrand
 * @memberof client.components.header
 */

const React = require('react');
const PropTypes = require('prop-types');
const { Navbar, Col } = require('react-bootstrap');

/**
 * @extends Component
 */
class HeaderBrand extends React.Component {
	render() {
		return (
			<div>
				<Col xsHidden componentClass={Navbar.Brand} className="">
					{this.props.title}
				</Col>
				<Col smHidden lgHidden mdHidden componentClass={Navbar.Brand} className="">
					{}
				</Col>
			</div>
		);
	}
}

HeaderBrand.propTypes = {
	title: PropTypes.string.isRequired
};

module.exports = HeaderBrand;
