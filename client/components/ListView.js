const React = require('react');
const { Container, Row, Col, Pagination } = require('react-bootstrap');
const { withRouter, Switch, Route, Link, Redirect } = require('react-router-dom');
const LinkContainer = require('./LinkContainer.js');

class ListView extends React.Component {
  render() {
    return (
      <Switch>
        <Route path={this.props.match.url} exact={true} render={({match}) => <Redirect to={match.url + '/0'} />} />
        <Route path={this.props.match.url + '/:index'} render={({match}) => this.renderListView(parseInt(match.params.index))} />
      </Switch>
    );
  }

  renderListView(pageIndex) {
    return (
      <div>
        <Container>{this.getRowElements(pageIndex)}</Container>
        <Pagination>{this.getPaginationElements(pageIndex)}</Pagination>
      </div>
    );
  }

  getPaginationElements(pageIndex) {
    const match = this.props.match;

    const paginationElements = [];
    const pageCount = this.getPageCount();

    if ((pageCount > 1) && (pageCount <= 10)) {
      for (let index = 0; index < pageCount; index++) {
        paginationElements.push(this.getPaginationItemElement(match, index));
      }
    } else if (pageCount > 10) {
      const url = match.url;
      
      if (pageIndex >= 3) {
        paginationElements.push(this.getPaginationElement(match, 0, <Pagination.First />));
        paginationElements.push(this.getPaginationElement(match, pageIndex - 3, <Pagination.Prev />));
      }
      
      let firstIndex = (pageIndex < 3) ? 0 : ((pageIndex >= (pageCount - 3)) ? (pageCount - 5) : (pageIndex - 2));
      for (let index = 0; index < 5; index++) {
        paginationElements.push(this.getPaginationItemElement(match, firstIndex + index));
      }
      
      if (pageIndex < (pageCount - 3)) {
        paginationElements.push(this.getPaginationElement(match, pageIndex + 3, <Pagination.Next />));
        paginationElements.push(this.getPaginationElement(match, pageCount - 1, <Pagination.Last />));
      }
    }

    return paginationElements;
  }

  getPaginationItemElement(match, pageIndex) {
    return this.getPaginationElement(match, pageIndex, <Pagination.Item>{pageIndex + 1}</Pagination.Item>);
  }

  getPaginationElement(match, pageIndex, wrappedElement) {
    return <LinkContainer to={match.url + '/' + pageIndex}>{wrappedElement}</LinkContainer>;
  }

  getRowElements(pageIndex) {
    const items = this.getItemsForPage(pageIndex);

    const columnWidth = 12 / this.props.columns;
    const columnElements = [];

    let index = 0;
    for (let row = 0; row < this.props.rows; row++) {
      const elements = [];
      for (let column = 0; column < this.props.columns; column++) {
        const item = items[index++];
        if (item) {
          elements.push(<Col md={columnWidth}><this.props.itemComponent item={item} /></Col>);
        }
      }
      columnElements.push(elements);
    }

    return columnElements.map(elements => <Row>{elements}</Row>);
  }

  getItemsForPage(pageIndex) {
    const pageBaseIndex = pageIndex * this.getPageSize();
    const items = this.props.items.slice(pageBaseIndex, pageBaseIndex + this.getPageSize());
    return this.props.vertical ? this.getItemsForPageVertical(items) : items;
  }

  getItemsForPageVertical(items) {
    const verticalItems = [];
    for (let index = 0; index < this.getPageSize(); index++) {
      const x = index % this.props.columns;
      const y = Math.floor(index / this.props.columns);
      const itemIndex = (x * this.props.rows) + y;

      const item = (index < items.length) ? items[(x * this.props.rows) + y] : null;

      verticalItems.push(item);
    }
    return verticalItems;
  }

  getPageCount() {
    return Math.floor(this.props.items.length / this.getPageSize()) + 1;
  }

  getPageSize() {
    return this.props.columns * this.props.rows;
  }
}

module.exports = withRouter(ListView);
