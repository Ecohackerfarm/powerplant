/**
 * @namespace LocationItem
 * @memberof client.components.locations
 */

const React = require('react');
const { Col, Panel } = require('react-bootstrap');
const PropTypes = require('prop-types');

/**
 * @extends Component
 */
class LocationItem extends React.Component {
	render() {
		return (
			<Col sm={6} lg={3}>
				<Panel className="panel-custom" header={this.props.header}>
					{this.props.item.loc.address}
				</Panel>
			</Col>
		)
	}
}

LocationItem.propTypes = {
	item: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string,
		loc: PropTypes.shape({
			coordinates: PropTypes.array
		})
	}),
	header: PropTypes.object.isRequired
};

module.exports = LocationItem;
