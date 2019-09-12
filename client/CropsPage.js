/**
 * @namespace CropsPage
 * @memberof client
 */

const React = require('react');
const { connect } = require('react-redux');
const { Badge } = require('react-bootstrap');
const PaginatedList = require('./shared/PaginatedList.js');
const CropListItem = require('./CropListItem.js');
const InputField = require('./shared/InputField.js');
const { updateCropAndSynchronize } = require('./redux/complex-actions.js');
const Crop = require('../shared/crop.js');

/**
 * CropsPage lists crops and lets the user to edit them.
 */
class CropsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cropFilter: '',
      filteredCrops: this.props.crops
    };

    this.onRenderItem = this.onRenderItem.bind(this);
    this.onSaveCrop = this.onSaveCrop.bind(this);
    this.onSearchFieldChange = this.onSearchFieldChange.bind(this);
  }

  render() {
    const { crops } = this.props;
    const { cropFilter, filteredCrops } = this.state;

    const sortedCrops = filteredCrops.sort((crop0, crop1) => {
      const name0 = Crop.getDisplayName(crop0);
      const name1 = Crop.getDisplayName(crop1);

      if (crop0.commonName && !crop1.commonName) {
        return -1;
      } else if (!crop0.commonName && crop1.commonName) {
        return 1;
      }

      return name0.localeCompare(name1);
    });

    const tagSet = Crop.findTagSet(crops);
    const tagBadges = tagSet.map(tag => <Badge variant="info">{tag}</Badge>);

    return (
      <div>
        <div>{tagBadges}</div>
        <InputField
          value={cropFilter}
          handleChange={this.onSearchFieldChange}
          handleEnter={() => {}}
          handleFocus={() => {}}
        />
        <PaginatedList
          items={sortedCrops}
          columns={3}
          rows={5}
          vertical={true}
          renderItem={this.onRenderItem}
        />
      </div>
    );
  }

  onRenderItem(item) {
    return <CropListItem crop={item} handleSave={this.onSaveCrop} />;
  }

  onSaveCrop(crop) {
    sanitizeNumberField(crop, 'hardinessZone');
    sanitizeNumberField(crop, 'matureHeight');
    sanitizeNumberField(crop, 'matureWidth');

    this.props.updateCrop(crop);
  }

  onSearchFieldChange(value) {
    const state = Object.assign({}, this.state, {
      cropFilter: value,
      filteredCrops: this.props.crops.filter(crop =>
        Crop
          .getDisplayName(crop)
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    });
    this.setState(state);
  }
}

function sanitizeNumberField(crop, property) {
  const number = parseFloat(crop[property]);
  crop[property] = number !== NaN ? number : 0;
}

const mapDispatchToProps = dispatch => ({
  updateCrop: crop => dispatch(updateCropAndSynchronize(crop))
});

const mapStateToProps = state => ({
  crops: Object.values(state.crops)
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(CropsPage);
