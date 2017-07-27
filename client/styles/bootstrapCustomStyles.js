// put all react-bootstrap custom bsStyle names here
// format is {component type}: [{stylename}]
// they get added at the beginning
// MAKE SURE the style actually exists in main.scss
// so if you add Button: ['floating'] there MUST be a btn-floating style in main.scss

import {bootstrapUtils} from 'react-bootstrap/lib/utils';

export const styles = {
  Button: ['floating']
};

export const addAllStyles = () => {
  for (let component in styles) {
    styles[component].forEach((style) => {
      console.log("Adding style " + style + " to component " + component);
      bootstrapUtils.addStyle(component, style);
    })
  }
}
