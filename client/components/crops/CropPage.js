const React = require('react');
const TagsInput = require('react-tagsinput');
require('react-tagsinput/react-tagsinput.css');
const { Redirect } = require('react-router-dom');
const { addCropTags, setCrop } = require('../../../shared/api-client.js');

/**
 *
 */
class CropPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tags: props.crop.tags.map(tag => tag.name),
      saved: false
    };
  }
  
  onSave() {
    const tagsToSave = this.state.tags.filter(name => this.props.tags.every(tag => (tag.name != name))).map(name => ({ name: name }));
    
    addCropTags({ documents: tagsToSave })
      .then(results => {
        this.props.crop.tags = this.state.tags.map(name => {
          let tag;
          
          tag = this.props.tags.find(tag => (tag.name == name));
          if (tag) {
            return tag;
          }
          
          return results.map(result => result.data).find(tag => (tag.name == name));
        });
        setCrop({ document: { tags: this.props.crop.tags.map(tag => tag._id) }, id: this.props.crop._id.toString() })
          .then(result => {
            this.setState({ saved: true });
          });
      });
  }
  
  render() {
    if (this.state.saved) {
      return <Redirect to='/crops' />;
    }
    
    return (
      <div>
        <h3>{ this.props.crop.binomialName }</h3>
        <TagsInput
          value = { this.state.tags }
          onChange = { (tags) => { this.setState({ tags }) } }
          />
        <button
          onClick = { this.onSave.bind(this) }
          >
          Save
        </button>
      </div>
    );
  }
}

module.exports = CropPage;
