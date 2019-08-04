/**
 * @namespace ListItem
 * @memberof client.shared
 */

const React = require('react');
const { Card, Button, Modal } = require('react-bootstrap');

/**
 * ListItem is a container for building a concise display of an object for use in lists. After
 * seeing the concise display, the user may choose to open the item into a modal window for
 * viewing or editing, or they may choose to delete the item.
 *
 * @param {Object}   props.modal
 * @param {Function} props.handleDelete
 */
class ListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };
  }

  render() {
    const { showModal } = this.state;
    const { children, modal, handleDelete } = this.props;

    return (
      <div>
        <Card>
          <Card.Header>
            <Button size="sm" onClick={handleDelete}>
              Delete
            </Button>
            <Button size="sm" onClick={() => this.showModal()}>
              Edit
            </Button>
          </Card.Header>
          <Card.Body>{children}</Card.Body>
        </Card>
        <Modal show={showModal} onHide={() => this.closeModal()}>
          <Modal.Body>{modal}</Modal.Body>
        </Modal>
      </div>
    );
  }

  showModal() {
    this.setShowModal(true);
  }

  closeModal() {
    this.setShowModal(false);
  }

  setShowModal(show) {
    this.setState({ showModal: show });
  }
}

module.exports = ListItem;
