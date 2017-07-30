import React from 'react';
import PropTypes from 'prop-types';
import {HelpBlock, Col, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';

const CrudableList = ({match, items, ItemView, itemName}) => (
  <Row>
    {items.length > 0 ?
    items.map(item => <Link key={item._id} to={`${match.url}/${item._id}/edit`}>
      <ItemView item={item} />
    </Link>)
    :
    <Col>
      <HelpBlock>No {itemName}s yet</HelpBlock>
    </Col>
    }
  </Row>
)

CrudableList.propTypes = {
  items: PropTypes.array.isRequired,
  ItemView: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired
}

export default CrudableList;
