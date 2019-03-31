const React = require('react');
const { connect } = require('react-redux');
const SelectDropdownWithSearch = require('./shared/SelectDropdownWithSearch.js');
const EditPanel = require('./shared/EditPanel.js');
const utils = require('../shared/utils.js');

/**
 * CropEditPanel is an editor for Crop objects.
 *
 * @param props.crop
 * @param props.handleSave
 * @param props.handleCancel
 */
class CropEditPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      crop: this.props.crop
    };

    this.onTagsChange = this.onTagsChange.bind(this);
  }

  render() {
    const { handleSave, handleCancel, crops } = this.props;
    const { crop } = this.state;

    const initialTags = utils.getCropTagNames(crop);
    const tagSet = utils.findTagSet(crops);

    return (
      <EditPanel
        title={utils.getCropDisplayName(crop)}
        handleSave={() => handleSave(crop)}
        handleCancel={handleCancel}>
        <SelectDropdownWithSearch items={tagSet} initialSelection={initialTags} title={'Tags'} multi={true} allowNewItems={true} handleChange={this.onTagsChange} />
      </EditPanel>
    );
  }

  onTagsChange(tagNames) {
    const { crop } = this.state;

    const tags = tagNames.map(name => ({ _id: null, name: name }));
    const newCrop = Object.assign({}, crop, { tags: tags });

    this.setState({ crop: newCrop });
  }
}

const mapStateToProps = state => ({
  crops: state.crops.all,
});

module.exports = connect(mapStateToProps, null)(CropEditPanel);
