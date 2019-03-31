const React = require('react');
const { InputGroup } = require('react-bootstrap');
const DropdownView = require('./DropdownView.js');
const { effectItemSelected, getSelectableItems } = require('./logic/select-dropdown.js');
const InputField = require('./InputField.js');
const { TAB, ENTER, ESCAPE } = require('./logic/input-field.js');

/**
 * SelectDropdownWithSearch is a component that is used for selecting items from a list. The
 * accompanying search field makes it possible to filter selectable items in large lists. When
 * props.allowNewItems=true it is possible to enter new items to the selection.
 *
 * @param {String[]} props.items
 * @param {String[]} props.initialSelection
 * @param {String}   props.title
 * @param {Boolean}  props.multi
 * @param {Boolean}  props.allowNewItems
 * @param {Function} props.handleSelect
 */
class SelectDropdownWithSearch extends React.Component {
  constructor(props) {
    super(props);

    const { items, initialSelection, multi, allowNewItems } = props;

    this.mode = {
      items: items,
      multi: multi,
      allowNewItems: allowNewItems,
    };

    this.state = {
      selected: initialSelection ? initialSelection : [],
      filter: '',
    };

    this.dropdownView = React.createRef();

    this.onSelect           = this.onSelect.bind(this);
    this.onInputValueChange = this.onInputValueChange.bind(this);
    this.onFunctionKey      = this.onFunctionKey.bind(this);
    this.onInputFocusChange = this.onInputFocusChange.bind(this);
  }

  render() {
    const { multi, items } = this.mode;
    const { selected, filter } = this.state;
    const { title } = this.props;

    const selectable = getFilteredSelectableItems(this.state, this.mode);

    return (
      <InputGroup>
        <DropdownView ref={this.dropdownView} title={title} multi={multi} selectable={selectable} selected={selected} filter={filter} handleSelect={this.onSelect} />
        <InputField value={filter} handleChange={this.onInputValueChange} handleFunctionKey={this.onFunctionKey} handleFocus={this.onInputFocusChange} />
      </InputGroup>
    );
  }

  onSelect(item) {
    const state0 = effectItemSelected(this.state, this.mode, item);
    const state1 = effectFilterChange(state0, this.mode, '');

    this.setState(state1);

    this.props.handleChange(state1.selected);
  }

  onInputValueChange(string) {
    const state = effectFilterChange(this.state, this.mode, string);
    this.setState(state);
  }

  onFunctionKey(key) {
    switch (key) {
      case TAB: {
        const filteredItems = getFilteredSelectableItems(this.state, this.mode);
        if (filteredItems.length > 0) {
          this.setState(effectFilterChange(this.state, this.mode, filteredItems[0]));
        }
        break;
      }
      case ENTER: {
        const filteredItems = getFilteredSelectableItems(this.state, this.mode);

        if (this.mode.allowNewItems) {
          if ((filteredItems.length > 0) && (filteredItems[0] == this.state.filter)) {
            this.onSelect(filteredItems[0]);
          } else if (this.state.filter.length > 0) {
            this.onSelect(this.state.filter);
          }
        } else {
          if (filteredItems.length > 0) {
            this.onSelect(filteredItems[0]);
          }
        }
        break;
      }
      case ESCAPE: {
        this.dropdownView.current.setShow(false);
        break;
      }
    }
  }

  onInputFocusChange(focus) {
    if (focus) {
      this.dropdownView.current.setShow(true);
    }
  }
}

function getFilteredSelectableItems(state, mode) {
  return getSelectableItems(state, mode).filter(item => item.includes(state.filter));
}

function effectFilterChange(state, mode, filter) {
  return Object.assign({}, state, { filter: filter });
}

module.exports = SelectDropdownWithSearch;
