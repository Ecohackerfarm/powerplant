/**
 * @namespace HeaderBrand
 * @memberof client.components.header
 */

 import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Col } from 'react-bootstrap';

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

export default HeaderBrand;
