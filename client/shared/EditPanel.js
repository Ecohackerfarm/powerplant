/**
 * @namespace EditPanel
 * @memberof client.shared
 */

const React = require('react');
const { Card, Button } = require('react-bootstrap');

/**
 * EditPanel is a container for building editors. When the user has done their editing, they may
 * choose to save or discard the changes.
 *
 * @param props.title
 * @param props.handleSave
 * @param props.handleCancel
 */
class EditPanel extends React.Component {
  render() {
    const { children, title, handleSave, handleCancel } = this.props;

    return (
      <Card>
        <Card.Title>{title}</Card.Title>
        <Card.Body>{children}</Card.Body>
        <Card.Footer>
          <Button size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </Card.Footer>
      </Card>
    );
  }
}

module.exports = EditPanel;
