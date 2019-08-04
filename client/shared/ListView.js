/**
 * @namespace ListView
 * @memberof client.shared
 */

const React = require('react');
const { Container, Row, Col } = require('react-bootstrap');

/**
 * ListView is a component that displays a list of arbitrary data in a grid. It doesn't control
 * the display of the individual items themselves, instead it calls props.renderItem() to ask the
 * user to render an item.
 *
 * @param {Object[]} props.items
 * @param {Number}   props.columns
 * @param {Number}   props.rows
 * @param {Boolean}  props.vertical
 * @param {Function} props.renderItem
 */
class ListView extends React.Component {
  render() {
    const { renderItem } = this.props;

    const [effectiveColumns, effectiveRows] = this.getEffectiveDimensions();
    const effectiveItems = this.getItemsInDisplayOrder();

    const columnWidth = 12 / effectiveColumns;

    const elements = [];

    let key = 0;
    for (; effectiveItems.length > 0; ) {
      const rowElements = effectiveItems
        .splice(0, effectiveColumns)
        .filter(item => item)
        .map(item => (
          <Col key={key++} md={columnWidth}>
            {renderItem(item)}
          </Col>
        ));
      elements.push(rowElements);
    }

    return (
      <Container>
        {elements.map((rowElements, index) => (
          <Row key={index}>{rowElements}</Row>
        ))}
      </Container>
    );
  }

  getItemsInDisplayOrder() {
    const { items, vertical } = this.props;

    let effectiveItems = [];
    if (vertical) {
      const [effectiveColumns, effectiveRows] = this.getEffectiveDimensions();

      for (let index = 0; index < effectiveColumns * effectiveRows; index++) {
        const x = index % effectiveColumns;
        const y = Math.floor(index / effectiveColumns);

        const verticalIndex = x * effectiveRows + y;
        const item = verticalIndex < items.length ? items[verticalIndex] : null;

        effectiveItems.push(item);
      }
    } else {
      effectiveItems = items;
    }

    return effectiveItems;
  }

  getEffectiveDimensions() {
    const { items, columns, rows } = this.props;

    let effectiveColumns;
    let effectiveRows;

    if (columns && rows) {
      effectiveColumns = columns;
      effectiveRows = rows;
    } else if (columns) {
      effectiveColumns = vertical ? 1 : columns;
      effectiveRows = Math.floor(items.length / effectiveColumns);
    } else {
      effectiveRows = vertical ? rows : 1;
      effectiveColumns = Math.floor(items.length / effectiveRows);
    }

    return [effectiveColumns, effectiveRows];
  }
}

module.exports = ListView;
