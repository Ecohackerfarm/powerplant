import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import '../../styles/AboutPage.scss';
class AboutPage extends React.Component {

	render() {
		return (
			<div className="about">
				<Grid>
					<Row>
						<Col id="imageTitle" sm={12}>

						</Col>
						<Col className="textTitle" sm={12}>
							<h1 className="pp-font">powerplant</h1>
						</Col>
					</Row>
					<Row className="textBody">
						<h4>An <a href="https://ecohackerfarm.org">Eco Hacker Farm</a> OpenSource Project under MIT license</h4>
					</Row>
					<Row className="textBody">
						<a href="https://powerplant.ecohackerfarm.org"><h4>powerplant.ecohackerfarm.org</h4></a>
					</Row>
					<Row className="textBody">
						<h4>Copyright (c) 2017 Ecohackerfarm</h4>
					</Row>
				</Grid>
			</div>
		);
	};
};

export default AboutPage;
