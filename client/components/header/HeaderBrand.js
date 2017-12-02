import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Col } from 'react-bootstrap';

const HeaderBrand = ({ title , imagePath }) =>
	<Col componentClass={Navbar.Brand} className="text-hide">
		{title}

	</Col>;

HeaderBrand.propTypes = {
	title: PropTypes.string.isRequired
};

export default HeaderBrand;
