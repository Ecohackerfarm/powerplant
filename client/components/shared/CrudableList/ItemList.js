import React from 'react';
import PropTypes from 'prop-types';
import { HelpBlock, Col, Row } from 'react-bootstrap';
import ItemHeader from './ItemHeader';

const CrudableList = ({ deleteAction, match, items, ItemView, itemName }) =>
	<Row>
		{items.length > 0
			? items.map(item =>
					<ItemView
						key={item._id}
						item={item}
						header={
							<ItemHeader
								name={item.name}
								editLink={`${match.url}/${item._id}/edit`}
								deleteAction={deleteAction.bind(this, item._id)} //binding to this id
							/>
						}
					/>
				)
			: <Col>
					<HelpBlock>
						No {itemName}s yet
					</HelpBlock>
				</Col>}
	</Row>;

CrudableList.propTypes = {
	match: PropTypes.object.isRequired,
	deleteAction: PropTypes.func,
	items: PropTypes.array.isRequired,
	ItemView: PropTypes.func.isRequired,
	itemName: PropTypes.string.isRequired
};

export default CrudableList;
