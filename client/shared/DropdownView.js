const React = require('react');
const { Dropdown } = require('react-bootstrap');

/**
 * DropdownView is a stateless component that displays a single or multi-select dropdown. It is
 * used for building different stateful select components, for example a single-select dropdown,
 * and then a single-select dropdown with a search field.
 *
 * @param {String[]} props.selectable
 * @param {String[]} props.selected
 * @param {String}   props.title
 * @param {Boolean}  props.multi
 * @param {Function} props.handleSelect
 */
class DropdownView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };

    this.onToggle = this.onToggle.bind(this);
  }

  render() {
    const { show } = this.state;
    const { selectable, selected, title, multi } = this.props;

    let effectiveTitle;
    const elements = [];

    if (multi) {
      effectiveTitle = title;

      this.pushItemElements(elements, selected);
      elements.push(<Dropdown.Divider />);
      this.pushItemElements(elements, selectable);
    } else {
      effectiveTitle = (selected.length > 0) ? selected[0] : title;
      this.pushItemElements(elements, selectable);
    }

    return (
      <Dropdown show={show} onToggle={this.onToggle}>
        <Dropdown.Toggle>{effectiveTitle}</Dropdown.Toggle>
        <Dropdown.Menu>{elements}</Dropdown.Menu>
      </Dropdown>
    );
  }

  onToggle(isOpen, event, metadata) {
    const { show } = this.state;
    const { multi } = this.props;

    const ignoredSources = [undefined];
    if (multi) {
      ignoredSources.push('select');
    }

    if (!ignoredSources.includes(metadata.source)) {
      this.setShow(!show);
    }
  }

  setShow(show) {
    this.setState({ show: show });
  }

  pushItemElements(elements, items) {
    items.forEach(item => {
      const element = <Dropdown.Item eventKey={item} onSelect={this.props.handleSelect}>{item}</Dropdown.Item>;
      elements.push(element);
    });
  }
}

module.exports = DropdownView;
