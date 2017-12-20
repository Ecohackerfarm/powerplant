import React from 'react';
import PropTypes from 'prop-types';
import { Typeahead } from 'react-bootstrap-typeahead';
import style from 'react-bootstrap-typeahead/css/Typeahead.css';
import { ToggleButton, ToggleButtonGroup, Row} from 'react-bootstrap';

class CropGroup extends React.Component {
  render(){
  	return(
  		<Row>
				<ToggleButtonGroup type="checkbox" defaultValue={[]}>
					<ToggleButton value={true}>green when clicked</ToggleButton>
				</ToggleButtonGroup>
	  		<Typeahead
					clearButton
					multiple
					options={this.props.cropGroup}
					defaultSelected={this.props.cropGroup}
					labelKey='commonName'
					placeholder='Bed is empty, choose crop ...'
				/>
			</Row>
	  );
  }
}

CropGroup.propTypes = {
	cropGroup : PropTypes.array.isRequired,
}

export default CropGroup;
