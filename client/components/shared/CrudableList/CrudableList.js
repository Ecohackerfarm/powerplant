import React from 'react';
import PropTypes from 'prop-types';
import {HelpBlock, Col, Row} from 'react-bootstrap';

const CrudableList = ({items, ItemView, itemName}) => (
  <Row>
    {items.length > 0 ?
    items.map(item => <ItemView key={item._id} item={item} />)
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
