import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
class AboutPage extends React.Component {

	render() {
		return (
			<div className="about">
				<Grid>
					<Row>
						<Col id="imageTitle" sm={12} md={6}>

						</Col>
						<Col className="textTitle" sm={12} md={6}>
							<h3>power<br/>&nbsp;&nbsp;&nbsp;plant</h3>
						</Col>
					</Row>
					<Row className="textBody">
						<h4>OpenSource Project</h4>
					</Row>
					<Row className="textBody">
						<a href="http://www.powerplant.com"><h4>www.powerplant.com</h4></a>
					</Row>
					<Row className="textBody">
						<h4>Copyright</h4>
					</Row>
				</Grid>
			</div>
		);
	};
};

export default AboutPage;
