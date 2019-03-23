const React = require('react');
const { Card, Button, Modal } = require('react-bootstrap');

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showEditModal: false
    };
  }

  render() {
    return (
      <div>
        <Card>
          <Card.Header><Button size="sm" onClick={() => this.onShowEditModal()}>Edit</Button></Card.Header>
          <Card.Body><this.props.contentComponent item={this.props.item} /></Card.Body>
        </Card>
        <Modal show={this.state.showEditModal} onHide={() => this.onCloseEditModal()}>
          <Modal.Header><Modal.Title>Edit item</Modal.Title></Modal.Header>
          <Modal.Body><this.props.editComponent item={this.props.item} /></Modal.Body>
          <Modal.Footer><Button onClick={() => this.onCloseEditModal()}>Save</Button></Modal.Footer>
        </Modal>
      </div>
    );
  }

  onShowEditModal() {
    this.setState({ showEditModal: true });
  }
  
  onCloseEditModal() {
    this.setState({ showEditModal: false });
    this.props.onSave(this.props.item);
  }
}

module.exports = ListItem;
