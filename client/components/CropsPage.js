const React = require('react');
const { connect } = require('react-redux');
const { Badge } = require('react-bootstrap');
const PaginatedList = require('./PaginatedList.js');
const CropListItem = require('./CropListItem.js');
const { fetchCrops } = require('../actions/cropActions.js');
const { cropsUpdated } = require('../actions/index.js');
const utils = require('../../shared/utils.js');

/**
 * CropsPage lists crops and lets the user to edit them.
 */
class CropsPage extends React.Component {
  constructor(props) {
    super(props);

    this.onRenderItem = this.onRenderItem.bind(this);
    this.onSaveCrop   = this.onSaveCrop.bind(this);
  }

  componentWillMount() {
    this.props.fetchCrops();
  }

  render() {
    const tagSet = utils.findTagSet(this.props.crops);
    const tagBadges = tagSet.map(tag => <Badge variant="info">{tag}</Badge>);

    return (
      <div>
        <div>{tagBadges}</div>
        <PaginatedList items={this.props.crops} columns={3} rows={5} vertical={true} renderItem={this.onRenderItem} />
      </div>
    );
  }

  onRenderItem(item) {
    return <CropListItem crop={item} handleSave={this.onSaveCrop} />;
  }

  onSaveCrop(crop) {
    const newCrops = this.props.crops.concat([]);

    const index = newCrops.findIndex(temp => (temp._id == crop._id));
    newCrops[index] = crop;

    this.props.updateCrops(newCrops);
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchCrops: () => dispatch(fetchCrops()),
  updateCrops: (crops) => dispatch(cropsUpdated(crops))
});

const mapStateToProps = (state) => ({
  crops: state.crops.all,
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(CropsPage);
