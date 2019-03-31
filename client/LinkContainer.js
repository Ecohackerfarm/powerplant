/**
 * TODO This is from commit 27b1e9c6903220ef46f08a5d086a32c892dba357 of react-router-bootstrap, move
 * to using an npm release once there is one out that is compatible with react-router-dom 5.0.0.
 */

const React = require('react');
const { Route, withRouter } = require('react-router-dom');

const isModifiedEvent = (event) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

class LinkContainer extends React.Component {
  handleClick(event) {
    const { children, onClick } = this.props;

    if (children.props.onClick) {
      children.props.onClick(event);
    }

    if (onClick) {
      onClick(event);
    }

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore right clicks
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();

      const { replace, to, history } = this.props;

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  }

  render() {
    const {
      history,
      location: _location,            // eslint-disable-line no-unused-vars
      match: _match,                  // eslint-disable-line no-unused-vars
      staticContext: _staticContext,  // eslint-disable-line no-unused-vars
      children,
      replace,                          // eslint-disable-line no-unused-vars
      to,
      exact,
      strict,
      activeClassName,
      className,
      activeStyle,
      style,
      isActive: getIsActive,
      ...props
    } = this.props;

    const href = history.createHref(
      typeof to === 'string' ? { pathname: to } : to
    );

    const child = React.Children.only(children);

    return (
      <Route
        path={typeof to === 'object' ? to.pathname : to}
        exact={exact}
        strict={strict}
        children={({ location, match }) => {
          const isActive = !!(getIsActive ? getIsActive(match, location) : match);

          return React.cloneElement(
            child,
            {
              ...props,
              className: [className, child.props.className, isActive ? activeClassName : null]
                .join(' ').trim(),
              style: isActive ? { ...style, ...activeStyle } : style,
              href,
              onClick: this.handleClick.bind(this),
            }
          );
        }}
      />
    );
  }
}

LinkContainer.defaultProps = {
  replace: false,
  exact: false,
  strict: false,
  activeClassName: 'active',
};

LinkContainer.handleClick = (event) => {
  const { children, onClick } = this.props;

  if (children.props.onClick) {
    children.props.onClick(event);
  }

  if (onClick) {
    onClick(event);
  }

  if (
    !event.defaultPrevented && // onClick prevented default
    event.button === 0 && // ignore right clicks
    !isModifiedEvent(event) // ignore clicks with modifier keys
  ) {
    event.preventDefault();

    const { replace, to, history } = this.props;

    if (replace) {
      history.replace(to);
    } else {
      history.push(to);
    }
  }
};


module.exports = withRouter(LinkContainer);
