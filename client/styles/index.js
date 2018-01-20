/**
 * Style utilities
 * 
 * @namespace styles
 * @memberof client
 */

import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import * as components from 'react-bootstrap';

/**
 * Custom styles for React-Bootstrap components.
 * 
 * Format is {componentName: [styleName]}. Each style must exist in
 * main.scss, so if you add {Button: ['floating']} there MUST be a
 * btn-floating style in main.scss.
 */
const styles = {
	Button: ['floating'],
	Panel: ['custom']
};

/**
 * Add all styles from the styles object to the corresponding React-Bootstrap
 * components so that they can be used for the bsStyle prop when using the
 * components.
 * 
 * @function
 */
export const addAllStyles = () => {
	for (let component in styles) {
		styles[component].forEach(style => {
			bootstrapUtils.addStyle(components[component], style);
		});
	}
};
