const React = require('react');
const { Pagination } = require('react-bootstrap');
const ListView = require('./ListView.js');

/**
 * PaginatedList is a list view component with pagination controls.
 *
 * @param {Object[]} props.items
 * @param {Number}   props.columns
 * @param {Number}   props.rows
 * @param {Boolean}  props.vertical
 * @param {Function} props.renderItem
 */
class PaginatedList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
    };
  }

  render() {
    const { currentPage } = this.state;
    const { columns, rows, vertical, renderItem } = this.props;

    const pageItems = this.getItemsForPage(currentPage);

    return (
      <div>
        <ListView items={pageItems} columns={columns} rows={rows} vertical={vertical} renderItem={renderItem} />
        <Pagination>{this.getPaginationElements()}</Pagination>
      </div>
    );
  }

  getPaginationElements() {
    const { currentPage } = this.state;

    const pageCount = this.getPageCount();

    const paginationElements = [];

    if ((pageCount > 1) && (pageCount <= 10)) {
      for (let index = 0; index < pageCount; index++) {
        paginationElements.push(this.getPaginationItemElement(index));
      }
    } else if (pageCount > 10) {
      if (currentPage >= 3) {
        paginationElements.push(this.getPaginationElement(Pagination.First, 0));
        paginationElements.push(this.getPaginationElement(Pagination.Prev, currentPage - 3));
      }

      let firstIndex = (currentPage < 3) ? 0 : ((currentPage >= (pageCount - 3)) ? (pageCount - 5) : (currentPage - 2));
      for (let index = 0; index < 5; index++) {
        paginationElements.push(this.getPaginationItemElement(firstIndex + index));
      }

      if (currentPage < (pageCount - 3)) {
        paginationElements.push(this.getPaginationElement(Pagination.Next, currentPage + 3));
        paginationElements.push(this.getPaginationElement(Pagination.Last, pageCount - 1));
      }
    }

    return paginationElements;
  }

  getPaginationItemElement(pageNumber) {
    return this.getPaginationElement(Pagination.Item, pageNumber, true);
  }

  getPaginationElement(component, pageNumber, showPageNumber = false) {
    return React.createElement(component,
      { onClick: () => this.onSelectPage(pageNumber) },
      showPageNumber ? new Number(pageNumber + 1).toString() : undefined);
  }

  getItemsForPage(pageNumber) {
    const pageBaseIndex = pageNumber * this.getPageSize();
    return this.props.items.slice(pageBaseIndex, pageBaseIndex + this.getPageSize());
  }

  getPageCount() {
    return Math.floor(this.props.items.length / this.getPageSize()) + 1;
  }

  getPageSize() {
    return this.props.columns * this.props.rows;
  }

  onSelectPage(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }
}

module.exports = PaginatedList;
