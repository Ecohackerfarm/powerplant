import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HelpBlock, Col, Row } from 'react-bootstrap';
import ItemHeader from './ItemHeader';

const CrudableList = ({ deleteAction, match, items, ItemView, itemName }) =>
	<Row>
		{items.length > 0
		 ? items.map(item =>
			 <Link
					 to={`${match.url}/${item._id}`}
					 key={item._id}>
				 <ItemView
						item={item}
						header={
							<ItemHeader
								name={item.name}
								editLink={`${match.url}/${item._id}/edit`}
								refreshLink={match.url}
								deleteAction={deleteAction.bind(this, item._id)} //binding to this id
							/>
						}
					/>
			 </Link>
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
