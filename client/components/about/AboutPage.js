/**
 * @namespace AboutPage
 * @memberof client.components.about
 */

const React = require('react');
const { Grid, Row, Col } = require('react-bootstrap');
require('../../styles/AboutPage.scss');

/**
 * About page
 *
 * @extends Component
 */
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

module.exports = AboutPage;
