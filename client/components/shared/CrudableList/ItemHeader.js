const React = require('react');
const PropTypes = require('prop-types');
const { LinkContainer } = require('react-router-bootstrap');
const { Row, Col, ButtonGroup, Button, Glyphicon } = require('react-bootstrap');

const ItemHeader = ({ name, editLink, refreshLink, deleteAction }) => (
	<Row className="title-center">
		<Col className="title-center" xs={6} >
				{name}
		</Col>
		<Col className="button-center" xs={6} >
			<ButtonGroup>
				{editLink && (
					<LinkContainer to={editLink}>
						<Button>
							<Glyphicon glyph="edit" />
						</Button>
					</LinkContainer>
				)}
				{deleteAction && (
					<LinkContainer to={refreshLink}>
						<Button onClick={deleteAction}>
							<Glyphicon glyph="trash" />
						</Button>
					</LinkContainer>
				)}
			</ButtonGroup>
		</Col>
	</Row>
);

ItemHeader.propTypes = {
	name: PropTypes.string,
	editLink: PropTypes.string,
	deleteAction: PropTypes.func
};

module.exports = ItemHeader;
