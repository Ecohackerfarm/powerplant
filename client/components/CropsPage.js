const React = require('react');
const { connect } = require('react-redux');
const { Badge } = require('react-bootstrap');
const ListView = require('./ListView.js');
const ListItem = require('./ListItem.js');
const TagsInput = require('react-tagsinput');
require('react-tagsinput/react-tagsinput.css');
const { fetchCrops } = require('../actions/cropActions.js');
const { cropsUpdated } = require('../actions/index.js');

class CropsPage extends React.Component {
  componentWillMount() {
    this.props.fetchCrops();
  }

  render() {
    const allTags = this.findAllTags();
    const tagBadges = allTags.map(tag => <Badge variant="info">{tag.name}</Badge>);

    return (
      <div>
        <div>{tagBadges}</div>
        <ListView items={this.props.crops} rows={5} columns={2} vertical={true} itemComponent={this.createItemComponent()} />
      </div>
    );
  }

  createItemComponent() {
    return (
      props => {
        const crop = props.item;
        let tagNames = crop.tags.map(tag => tag.name);
        
        return (
          <ListItem
            item={crop}
            contentComponent={({item}) => (item.commonName ? item.commonName : item.binomialName)}
            editComponent={this.createItemEditComponent(tagNames)}
            onSave={item => this.onSaveCrop(item, tagNames)}
          />
        );
      }
    );
  }

  createItemEditComponent(tagNames) {
    return (
      ({item}) => (
        <div>
          <p>{item.commonName ? item.commonName : item.binomialName}</p>
          <TagsInput value={tagNames} onChange={tags => tagNames.splice(0, tagNames.length, ...tags)} />
        </div>
      )
    );
  }

  onSaveCrop(crop, tagNames) {
    crop.tags = tagNames.map(tagName => ({ name: tagName }));
    
    this.props.updateCrops(this.props.crops);
    this.forceUpdate(); // TODO Why the above is not triggering a render?
  }

  findAllTags() {
		const tagNames = [];
		const tags = [];
		
		this.props.crops.forEach(crop => {
			if (crop.tags) {
				crop.tags.forEach(tag => {
					if (!tagNames.includes(tag.name)) {
						tagNames.push(tag.name);
						tags.push(tag);
					}
				});
			}
		});
		
		return tags;
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
