import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HelpBlock, Col, Row } from 'react-bootstrap';
import ItemHeader from './ItemHeader';

const ItemList = ({ deleteAction, match, items, ItemView, itemName }) => {
	const itemEntries = Object.entries(items);
	return (
		<Row>
			{itemEntries.length > 0 ? (
				itemEntries.map(([id,item]) => (
					<Link to={`${match.url}/${id}`} key={id}>
						<ItemView
							item={item}
							header={
								<ItemHeader
									name={
										typeof item.name !== 'undefined'
										? item.name
										: itemName
									}
									editLink={`${match.url}/${id}/edit`}
									refreshLink={match.url}
									deleteAction={deleteAction.bind(this, id)} //binding to this id
								/>
							}
						/>
					</Link>
				))
			) : (
				<Col>
					<HelpBlock>No {itemName}s yet</HelpBlock>
				</Col>
			)}
		</Row>
	);
}

ItemList.propTypes = {
	match: PropTypes.object.isRequired,
	deleteAction: PropTypes.func,
	items: PropTypes.object.isRequired,
	ItemView: PropTypes.func.isRequired,
	itemName: PropTypes.string.isRequired
};

export default ItemList;
