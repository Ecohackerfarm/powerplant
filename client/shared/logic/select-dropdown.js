/**
 * @namespace select-dropdown
 * @memberof client.shared.logic
 */

function effectItemSelected(state, mode, item) {
  let selected = state.selected.concat([]);

  if (mode.multi) {
    if (selected.includes(item)) {
      selected = selected.filter(x => x != item);
    } else {
      selected.push(item);
    }
  } else {
    selected = [item];
  }

  return Object.assign({}, state, { selected: selected });
}

function getSelectableItems(state, mode) {
  const { multi, items } = mode;
  const { selected } = state;

  if (!multi) {
    return items;
  }

  return items.filter(item => !selected.includes(item));
}

module.exports = {
  effectItemSelected,
  getSelectableItems
};
