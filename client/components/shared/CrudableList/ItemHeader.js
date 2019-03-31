const React = require('react');
const LinkContainer = require('../../../LinkContainer.js');
const { Row, Col, ButtonGroup, Button } = require('react-bootstrap');

const ItemHeader = ({ name, editLink, refreshLink, deleteAction }) => (
	<Row>
		<Col xs={6} >
				{name}
		</Col>
		<Col xs={6} >
			<ButtonGroup>
				{editLink && (
					<LinkContainer to={editLink}>
						<Button>
							Edit
						</Button>
					</LinkContainer>
				)}
				{deleteAction && (
					<LinkContainer to={refreshLink}>
						<Button onClick={deleteAction}>
							Delete
						</Button>
					</LinkContainer>
				)}
			</ButtonGroup>
		</Col>
	</Row>
);

module.exports = ItemHeader;
