/**
 * @namespace CropListItem
 * @memberof client
 */

const React = require('react');
const ListItem = require('./shared/ListItem.js');
const CropEditPanel = require('./CropEditPanel.js');
const Crop = require('../shared/crop.js');

/**
 * CropListItem is a component for displaying a Crop object in a list.
 *
 * @param {Crop}     props.crop
 * @param {Function} props.handleSave
 */
class CropListItem extends React.Component {
  constructor(props) {
    super(props);

    this.listItem = React.createRef();

    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  render() {
    const { crop } = this.props;

    return (
      <ListItem
        ref={this.listItem}
        modal={
          <CropEditPanel
            crop={crop}
            handleSave={this.onSave}
            handleCancel={this.onCancel}
          />
        }
      >
        {Crop.getDisplayName(crop)}
      </ListItem>
    );
  }

  onSave(crop) {
    this.closeModal();
    this.props.handleSave(crop);
  }

  onCancel() {
    this.closeModal();
  }

  closeModal() {
    this.listItem.current.closeModal();
  }
}

module.exports = CropListItem;
