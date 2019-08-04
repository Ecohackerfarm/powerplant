/**
 * @namespace SelectDropdown
 * @memberof client.shared
 */

const React = require('react');
const DropdownView = require('./DropdownView.js');
const {
  effectItemSelected,
  getSelectableItems
} = require('./logic/select-dropdown.js');

/**
 * SelectDropdown is a component that is used for selecting items from a list.
 *
 * @param {String[]} props.items
 * @param {String[]} props.initialSelection
 * @param {String}   props.title
 * @param {Boolean}  props.multi
 * @param {Function} props.handleChange
 */
class SelectDropdown extends React.Component {
  constructor(props) {
    super(props);

    const { items, initialSelection, multi } = props;

    this.mode = {
      items: items,
      multi: multi
    };

    this.state = {
      selected: initialSelection ? initialSelection : []
    };

    this.onSelect = this.onSelect.bind(this);
  }

  render() {
    const { multi } = this.mode;
    const { selected } = this.state;
    const { title } = this.props;

    const selectable = getSelectableItems(this.state, this.mode);

    return (
      <DropdownView
        selectable={selectable}
        selected={selected}
        title={title}
        multi={multi}
        show={false}
        handleSelect={this.onSelect}
      />
    );
  }

  onSelect(item) {
    const newState = effectItemSelected(this.state, this.mode, item);
    this.setState(newState);
    this.props.handleChange(newState.selected);
  }
}

module.exports = SelectDropdown;
