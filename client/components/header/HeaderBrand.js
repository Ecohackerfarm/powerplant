import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Col } from 'react-bootstrap';

const HeaderBrand = ({ title, imagePath }) => (
<div>
	<Col xsHidden componentClass={Navbar.Brand} className="">
			{title}
	</Col>
	<Col smHidden lgHidden mdHidden componentClass={Navbar.Brand} className="">
		{}
	</Col>
</div>
	)

HeaderBrand.propTypes = {
	title: PropTypes.string.isRequired
};

export default HeaderBrand;
